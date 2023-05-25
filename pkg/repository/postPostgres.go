package repository

import (
	user "backend_ajax-people"
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
	"time"
)

type PostPostgres struct {
	db *sqlx.DB
}

func NewPostPostgres(db *sqlx.DB) *PostPostgres {
	return &PostPostgres{db: db}
}

func (r *PostPostgres) CreatePost(post user.Post, tags []int, isAdmin bool) (int, error) {
	var postId int

	query := fmt.Sprintf(
		`SELECT DISTINCT po.id, po.publication_time
					FROM %s po WHERE po.user_id = $1  ORDER BY publication_time DESC;`, postsTable)
	var postsList []user.Post
	if err := r.db.Select(&postsList, query, post.UserId); err != nil {
		return 0, err
	}

	timePost, _ := time.Parse("2006-01-02T15:04:05Z", postsList[0].PublicationTime)
	timeNow := time.Now().Format("2006-01-02T15:04:05Z")
	timeNowParse, _ := time.Parse("2006-01-02T15:04:05Z", timeNow)
	timePostUnix := timePost.Unix()
	timeNowParseUnix := timeNowParse.Unix()
	timeDeltaNowPost := (timeNowParseUnix - timePostUnix) / 3600

	if timeDeltaNowPost < 12 && isAdmin == false {
		err := errors.New("it hasn't been 12 hours since the last post")
		return 0, err
	}

	query = fmt.Sprintf("INSERT INTO %s (user_id, text, publication_time) VALUES ($1, $2, $3) RETURNING id", postsTable)

	row := r.db.QueryRow(query, post.UserId, post.Text, post.PublicationTime)
	if err := row.Scan(&postId); err != nil {
		return 0, err
	}

	for i := 0; i < len(tags); i++ {
		var plug int

		query = fmt.Sprintf("INSERT INTO %s (post_id, tag_id) values ($1, $2) RETURNING id", postsTagsTable)
		row = r.db.QueryRow(query, postId, tags[i])
		if err := row.Scan(&plug); err != nil {
			return 0, err
		}
	}

	return postId, nil
}

func (r *PostPostgres) GetPostById(id int) (user.Post, error) {
	var post user.Post
	postQuery := fmt.Sprintf("SELECT user_id, text, is_moderated, publication_time FROM %s WHERE id=$1", postsTable)
	err := r.db.Get(&post, postQuery, id)
	if err != nil {
		return post, err
	}

	var tagsList []user.Tag
	tagsQuery := fmt.Sprintf(
		"SELECT id, title FROM %s WHERE id IN (SELECT tag_id FROM %s pst JOIN %s pt ON pst.id = pt.post_id WHERE pst.id = $1)",
		tagsTable, postsTable, postsTagsTable)
	err = r.db.Select(&tagsList, tagsQuery, id)

	post.Tags = tagsList

	return post, err
}

var orderTypesSql = []string{"DESC", "ASC"}

func (r *PostPostgres) GetPostByPage(filter user.PostFilter, page int, items int, isAdmin bool, idUser int) ([]user.Post, error) {
	var postListPage []user.Post

	orderType := orderTypesSql[filter.OrderBy]
	addQuery := ""
	isModer := ""

	if !isAdmin {
		isModer += "WHERE po.is_moderated=true"
	}

	if len(filter.TagsList) > 0 {
		tagsList := strings.Trim(strings.Join(strings.Fields(fmt.Sprint(filter.TagsList)), ","), "[]")
		addQuery = fmt.Sprintf("AND pt.tag_id IN (%s)", tagsList)
	}

	query := fmt.Sprintf(
		`SELECT DISTINCT po.id, po.user_id, po.text, po.is_moderated, po.publication_time FROM %s po
    					JOIN %s pt ON po.id = pt.post_id %s %s ORDER BY publication_time %s ;`,
		postsTable, postsTagsTable, addQuery, isModer, orderType)
	fmt.Println(query)

	var postsList []user.Post
	if err := r.db.Select(&postsList, query); err != nil {
		return nil, err
	}
	query = fmt.Sprintf(
		`SELECT DISTINCT po.id, po.user_id, po.text, po.is_moderated, po.publication_time FROM %s po
    					JOIN %s pt ON po.id = pt.post_id %s WHERE po.user_id = $1 AND po.is_moderated=false;`,
		postsTable, postsTagsTable, addQuery)
	fmt.Println(query)

	var postsList1 []user.Post
	if err := r.db.Select(&postsList1, query, idUser); err != nil {
		return nil, err
	}
	postsList = append(postsList, postsList1...)

	for i := 0; i < len(postsList); i++ {
		var tagsList []user.Tag
		tagsQuery := fmt.Sprintf(
			"SELECT id, title FROM %s WHERE id IN (SELECT tag_id FROM %s pst JOIN %s pt ON pst.id = pt.post_id WHERE pst.id = $1)",
			tagsTable, postsTable, postsTagsTable)
		err := r.db.Select(&tagsList, tagsQuery, postsList[i].Id)
		if err != nil {
			return postsList, err
		}

		postsList[i].Tags = tagsList
	}

	if page == -1 || items == 0 {
		return postsList, nil
	}

	var lastItems int
	if page*items+items-len(postsList) > 0 && items-((page*items)+items-len(postsList)) <= 0 {
		err := errors.New("There are no posts on this page")
		return postsList, err
	} else if page*items+items > len(postsList) {
		lastItems = items - ((page * items) + items - len(postsList))
	} else {
		lastItems = items
	}

	for i := page * items; i < page*items+lastItems; i++ {
		postListPage = append(postListPage, postsList[i])
	}

	return postListPage, nil
}

func (r *PostPostgres) GetAllPosts(filter user.PostFilter, isAdmin bool, idUser int) ([]user.Post, error) {
	orderType := orderTypesSql[filter.OrderBy]
	addQuery := ""
	isModer := ""

	if !isAdmin {
		isModer += "WHERE po.is_moderated=true"
	}

	if len(filter.TagsList) > 0 {
		tagsList := strings.Trim(strings.Join(strings.Fields(fmt.Sprint(filter.TagsList)), ","), "[]")
		addQuery = fmt.Sprintf("AND pt.tag_id IN (%s)", tagsList)
	}

	query := fmt.Sprintf(
		`SELECT DISTINCT po.id, po.user_id, po.text, po.is_moderated, po.publication_time FROM %s po
    					JOIN %s pt ON po.id = pt.post_id %s %s ORDER BY publication_time %s;`,
		postsTable, postsTagsTable, addQuery, isModer, orderType)

	var postsList []user.Post
	if err := r.db.Select(&postsList, query); err != nil {
		return nil, err
	}
	query = fmt.Sprintf(
		`SELECT DISTINCT po.id, po.user_id, po.text, po.is_moderated, po.publication_time FROM %s po
    					JOIN %s pt ON po.id = pt.post_id %s WHERE po.user_id = $1 AND po.is_moderated=false ORDER BY publication_time %s;`,
		postsTable, postsTagsTable, addQuery, orderType)

	fmt.Println(query)
	var postsList1 []user.Post
	if err := r.db.Select(&postsList1, query, idUser); err != nil {
		return nil, err
	}
	postsList = append(postsList, postsList1...)

	for i := 0; i < len(postsList); i++ {
		var tagsList []user.Tag
		tagsQuery := fmt.Sprintf(
			"SELECT id, title FROM %s WHERE id IN (SELECT tag_id FROM %s pst JOIN %s pt ON pst.id = pt.post_id WHERE pst.id = $1)",
			tagsTable, postsTable, postsTagsTable)
		err := r.db.Select(&tagsList, tagsQuery, postsList[i].Id)
		if err != nil {
			return postsList, err
		}

		postsList[i].Tags = tagsList
	}

	return postsList, nil
}

func (r *PostPostgres) UpdatePost(id int, isModerated bool) error {
	query := fmt.Sprintf("UPDATE %s SET is_moderated=$1", postsTable)
	_, err := r.db.Exec(query, isModerated)
	return err
}

func (r *PostPostgres) DeletePost(id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", postsTable)
	_, err := r.db.Exec(query, id)
	return err
}

func (r *PostPostgres) CreateTag(tag user.Tag) (int, error) {
	var tagId int

	query := fmt.Sprintf("INSERT INTO %s (title) VALUES ($1) RETURNING id", tagsTable)

	row := r.db.QueryRow(query, tag.Title)
	if err := row.Scan(&tagId); err != nil {
		return 0, err
	}

	return tagId, nil
}

func (r *PostPostgres) GetTagById(id int) (user.Tag, error) {
	var tag user.Tag

	query := fmt.Sprintf("SELECT id, title FROM %s WHERE id=$1", tagsTable)
	err := r.db.Get(&tag, query, id)

	return tag, err
}

func (r *PostPostgres) GetAllTags() ([]user.Tag, error) {
	var tagsList []user.Tag

	query := fmt.Sprintf("SELECT id, title FROM %s", tagsTable)
	if err := r.db.Select(&tagsList, query); err != nil {
		return nil, err
	}

	return tagsList, nil
}

func (r *PostPostgres) DeleteTag(id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", tagsTable)
	_, err := r.db.Exec(query, id)
	return err
}
