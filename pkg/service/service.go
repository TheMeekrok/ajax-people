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
	GetUserById(id int) (user.UserOutput, error)
	DeleteUser(id int) error
	UpdateUser(id int, user user.UpdateUserInput) error
	GetAllUsers(page, items int) ([]user.UserOutput, error)
	SelectedDataUser(userSelect user.UpdateUserInput, idUser, page, items int) ([]user.UserOutput, error)
	RequestСorrespondence(idSender int, emailRecipient string) (int, error)
	AcceptMessageRequest(idRequest int) error
	ChangeUserOnAdmin(id int, isAdmin bool) error
	BanUser(id int, isBan bool) error
}

type RegisterData interface {
	GetAllInterests(id int) ([]user.Interest, error)

	GetAllFaculties(id int) ([]user.Faculty, error)
	GetAllStatuses(id int) []user.StatusUser
	GetAllEdLevels(id int) []user.EducationLevel
	GetAllSchools(id int) ([]user.School, error)
}

type Mail interface {
	SendCodeActivation(id int) error
	CheckCodeActivation(id int, rdmKey string) (bool, error)
}

type Post interface {
	CreatePost(text string, tags []int, userId int, isAdmin bool) (int, error)
	GetPostById(id int) (user.Post, error)
	GetPostByPage(filter user.PostFilter, page int, items int, isAdmin bool, idUser int) ([]user.Post, error)
	GetAllPosts(filter user.PostFilter, isAdmin bool, idUser int) ([]user.Post, error)
	UpdatePost(id int, isModerated bool) error
	DeletePost(id int) error
	CreateTag(title string) (int, error)
	GetTagById(id int) (user.Tag, error)
	GetAllTags() ([]user.Tag, error)
	DeleteTag(id int) error
	GetPostByPageNoModer(page int, items int) ([]user.Post, error)
	DeleteInterest(id int) error
	CreateInterest(title string) (int, error)
}

type Uploader interface {
	Upload(id int, file []byte, size int64, contextType string) (string, error)
	GetAvatar(id int) (string, error)
	generateFileName() string
}

type Rating interface {
	EvaluationUser(userId, userReactedId, grade int) (bool, error)
	GetRating(userId, userReactedId int) (int, error)
}

type Service struct {
	Authorization
	UserAction
	Mail
	RegisterData
	Post
	Uploader
	Rating
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		NewAuthService(repos.Authorization),
		NewUserActionService(repos.UserAction),
		NewSendMessageService(repos.Mail),
		NewRegisterDataService(repos.RegisterData),
		NewPostService(repos.Post),
		NewUploaderService(repos.FileStorageImage),
		NewRaitingSystem(repos.RatingSys),
	}
}
