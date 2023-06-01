package repository

import (
	user "backend_ajax-people"
	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user user.User) (int, error)
	GetUser(username, password string) (user.User, error)
}

type UserAction interface {
	CreateUser(user user.User) (int, error)
	GetUser(id int) (user.UserOutput, error)
	GetAllUsers() ([]user.User, error)
	DeleteUser(id int) error
	UpdateUser(id int, user user.UpdateUserInput) error
	SelectedDataUser(userSelect user.UpdateUserInput, idUser, page, items int) ([]user.UserOutput, error)
	RequestСorrespondence(idSender int, emailRecipient, coincidenceTime string) (int, error)
	AcceptMessageRequest(idRequest int) error
	ChangeUserOnAdmin(id int) error
}

type Mail interface {
	SendCodeActivation(id int, rdmKey string) (string, error)
	CheckCodeActivation(id int, rdmKey string) (bool, error)
}

type RegisterData interface {
	GetAllFaculties(id int) ([]user.Faculty, error)
	GetAllInterests(id int) ([]user.Interest, error)
	GetAllSchools(id int) ([]user.School, error)
}

type Post interface {
	CreatePost(post user.Post, tags []int, isAdmin bool) (int, error)
	GetPostById(id int) (user.Post, error)
	GetPostByPage(filter user.PostFilter, page int, items int, isAdmin bool, idUser int) ([]user.Post, error)
	GetPostByPageNoModer(page int, items int) ([]user.Post, error)
	GetAllPosts(filter user.PostFilter, isAdmin bool, idUser int) ([]user.Post, error)
	UpdatePost(id int, isModerated bool) error
	DeletePost(id int) error
	CreateTag(tag user.Tag) (int, error)
	GetTagById(id int) (user.Tag, error)
	GetAllTags() ([]user.Tag, error)
	DeleteTag(id int) error
}

type FileStorageImage interface {
	Upload(id int, input UploadInput) (string, error)
	GetAvatar(id int) (string, error)
}

type RaitingSys interface {
	UpRaiting(id int) error
}

type Repository struct {
	Authorization
	UserAction
	Mail
	RegisterData
	Post
	FileStorageImage
	RaitingSys
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Authorization:    NewAuthPostgres(db),
		UserAction:       NewUserActionPostgres(db),
		Mail:             NewMailPostgres(db),
		RegisterData:     NewRegisterDataPostgres(db),
		Post:             NewPostPostgres(db),
		FileStorageImage: NewFileStorage(db),
		RaitingSys:       NewRaitingSystemPostgres(db),
	}
}
