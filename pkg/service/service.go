package service

import (
	user "backend_ajax-people"
	"backend_ajax-people/pkg/repository"
)

type Authorization interface {
	CreateUser(user user.User) (int, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (int, bool, bool, error)
}

type UserAction interface {
	CreateUser(user user.User) (int, error)
	GetUserById(id int) (user.User, error)
	DeleteUser(id int) error
	UpdateUser(id int, user user.UpdateUserInput) error
	GetAllUsers() ([]user.User, error)
	SelectedDataUser(userSelect user.UpdateUserInput) ([]user.User, error)
	RequestСorrespondence(idSender int, emailRecipient string) (int, error)
	AcceptMessageRequest(idRequest int) error
}

type RegisterData interface {
	GetAllFaculties() ([]user.Faculty, error)
	GetAllInterests() ([]user.Interest, error)
	GetAllStatuses() []user.StatusUser
	GetAllEdLevels() []user.EducationLevel
	GetAllSchools() ([]user.School, error)
}

type Mail interface {
	SendCodeActivation(id int) error
	CheckCodeActivation(id int, rdmKey string) (bool, error)
}

type Post interface {
	CreatePost(text string, tags []int, userId int) (int, error)
	GetPostById(id int) (user.Post, error)
	GetPostByPage(filter user.PostFilter, page int, items int, isAdmin bool, idUser int) ([]user.Post, error)
	GetAllPosts(filter user.PostFilter, isAdmin bool, idUser int) ([]user.Post, error)
	UpdatePost(id int, isModerated bool) error
	DeletePost(id int) error
	CreateTag(title string) (int, error)
	GetTagById(id int) (user.Tag, error)
	GetAllTags() ([]user.Tag, error)
	DeleteTag(id int) error
}

type Uploader interface {
	Upload(id int, file []byte, size int64, contextType string) (string, error)
	GetAvatar(id int) (string, error)
	generateFileName() string
}

type Service struct {
	Authorization
	UserAction
	Mail
	RegisterData
	Post
	Uploader
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		NewAuthService(repos.Authorization),
		NewUserActionService(repos.UserAction),
		NewSendMessageService(repos.Mail),
		NewRegisterDataService(repos.RegisterData),
		NewPostService(repos.Post),
		NewUploaderService(repos.FileStorageImage),
	}
}
