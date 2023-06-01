package service

import "backend_ajax-people/pkg/repository"

type RaitingSystem struct {
	repo repository.RaitingSys
}

func NewRaitingSystem(repo repository.RaitingSys) *RaitingSystem {
	return &RaitingSystem{repo: repo}
}
