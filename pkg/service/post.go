package service

import (
	user "backend_ajax-people"
	"backend_ajax-people/pkg/repository"
	"fmt"
	"time"
)

type PostService struct {
	repo repository.Post
}

func NewPostService(repo repository.Post) *PostService {
	return &PostService{repo: repo}
}

const (
	timeFormat = "2006-01-02T15:04:05Z"
)

func (s *PostService) CreatePost(text string, tags []int, userId int, isAdmin bool) (int, error) {
	pblTime := fmt.Sprintln(time.Now().Format(timeFormat))
	newPost := user.Post{UserId: userId, Text: text, PublicationTime: pblTime}
	return s.repo.CreatePost(newPost, tags, isAdmin)
}

func (s *PostService) GetPostById(id int) (user.Post, error) {
	return s.repo.GetPostById(id)
}

func (s *PostService) GetPostByPage(filter user.PostFilter, page int, items int, isAdmin bool, idUser int) ([]user.Post, error) {
	return s.repo.GetPostByPage(filter, page, items, isAdmin, idUser)
}

func (s *PostService) GetAllPosts(filter user.PostFilter, isAdmin bool, idUser int) ([]user.Post, error) {
	return s.repo.GetAllPosts(filter, isAdmin, idUser)
}

func (s *PostService) UpdatePost(id int, isModerated bool) error {
	return s.repo.UpdatePost(id, isModerated)
}

func (s *PostService) DeletePost(id int) error {
	return s.repo.DeletePost(id)
}

func (s *PostService) CreateTag(title string) (int, error) {
	newTag := user.Tag{Title: title}
	return s.repo.CreateTag(newTag)
}

func (s *PostService) GetTagById(id int) (user.Tag, error) {
	return s.repo.GetTagById(id)
}

func (s *PostService) GetAllTags() ([]user.Tag, error) {
	return s.repo.GetAllTags()
}

func (s *PostService) DeleteTag(id int) error {
	return s.repo.DeleteTag(id)
}
