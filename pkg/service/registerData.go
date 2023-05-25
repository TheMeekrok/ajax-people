package service

import (
	user "backend_ajax-people"
	"backend_ajax-people/pkg/repository"
)

type RegisterDataService struct {
	repo repository.RegisterData
}

func NewRegisterDataService(repo repository.RegisterData) *RegisterDataService {
	return &RegisterDataService{repo: repo}
}

func (s *RegisterDataService) GetAllFaculties(id int) ([]user.Faculty, error) {
	return s.repo.GetAllFaculties(id)
}

func (s *RegisterDataService) GetAllInterests(id int) ([]user.Interest, error) {
	interests, err := s.repo.GetAllInterests(id)
	if err != nil {
		return interests, err
	}

	return interests, nil
}

var statusesSlice = []user.StatusUser{
	{0, "student"},
	{1, "teacher"},
	{2, "graduated"},
	{3, "other"},
}

func (s *RegisterDataService) GetAllStatuses(id int) []user.StatusUser {
	return statusesSlice
}

var edLevelsSlice = []user.EducationLevel{
	{0, "bachelor"},
	{1, "master"},
	{2, "specialist"},
	{3, "other"},
}

func (s *RegisterDataService) GetAllEdLevels(id int) []user.EducationLevel {
	return edLevelsSlice
}

func (s *RegisterDataService) GetAllSchools(id int) ([]user.School, error) {
	return s.repo.GetAllSchools(id)
}
