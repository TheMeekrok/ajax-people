package user

type Post struct {
	Id              int    `json:"id" db:"id"`
	UserId          int    `json:"userId" db:"user_id" binding:"required"`
	Text            string `json:"text" db:"text" binding:"required"`
	IsModerated     bool   `json:"isModerated" db:"is_moderated" binding:"required"`
	PublicationTime string `json:"publicationTime" db:"publication_time"`
	Tags            []Tag  `json:"tags" db:"tags_id"`
}

type OrderType int8

const (
	Ascending OrderType = iota
	Descending
)

type PostFilter struct {
	TagsList []int     `json:"tagsList"`
	OrderBy  OrderType `json:"orderBy"`
}

type Tag struct {
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title" binding:"required"`
}
