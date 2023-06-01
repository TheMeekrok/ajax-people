package service

import "backend_ajax-people/pkg/repository"

type RaitingSystem struct {
	repo repository.RaitingSys
}

func NewRaitingSystem(repo repository.RaitingSys) *RaitingSystem {
	return &RaitingSystem{repo: repo}
}

func (s RaitingSystem) EvaluationUser(userId, userReactedId, grade int) (bool, error) {
	return s.repo.UpRaiting(userId, userReactedId, grade)
}
