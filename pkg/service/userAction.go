package service

import (
	user "backend_ajax-people"
	"backend_ajax-people/pkg/repository"
	"fmt"
	"time"
)

type UserActionService struct {
	repo repository.UserAction
}

func NewUserActionService(repo repository.UserAction) *UserActionService {
	return &UserActionService{repo: repo}
}

func (s *UserActionService) CreateUser(user user.User) (int, error) {
	user.Password = generatePasswordHash(user.Password)
	return s.repo.CreateUser(user)
}

func (s *UserActionService) GetUserById(id int) (user.UserOutput, error) {
	return s.repo.GetUser(id)
}

func (s *UserActionService) DeleteUser(id int) error {
	return s.repo.DeleteUser(id)
}

func (s *UserActionService) UpdateUser(id int, user user.UpdateUserInput) error {
	return s.repo.UpdateUser(id, user)
}

func (s *UserActionService) GetAllUsers(page, items int) ([]user.UserOutput, error) {
	return s.repo.GetAllUsers(page, items)
}

func (s *UserActionService) SelectedDataUser(userSelect user.UpdateUserInput, idUser, page, items int) ([]user.UserOutput, error) {
	return s.repo.SelectedDataUser(userSelect, idUser, page, items)
}

func (s *UserActionService) RequestСorrespondence(idSender int, emailRecipient string) (int, error) {
	coincidenceTime := fmt.Sprintln(time.Now().Format(timeFormat))
	return s.repo.RequestСorrespondence(idSender, emailRecipient, coincidenceTime)
}

func (s *UserActionService) AcceptMessageRequest(idRequest int) error {
	return s.repo.AcceptMessageRequest(idRequest)
}

func (s *UserActionService) ChangeUserOnAdmin(id int, isAdmin bool) error {
	return s.repo.ChangeUserOnAdmin(id, isAdmin)
}

func (s *UserActionService) BanUser(id int, isBan bool) error {
	return s.repo.BanUser(id, isBan)
}
