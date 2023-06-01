package repository

import "github.com/jmoiron/sqlx"

type RaitingSystemPostgres struct {
	db *sqlx.DB
}

func NewRaitingSystemPostgres(db *sqlx.DB) *RaitingSystemPostgres {
	return &RaitingSystemPostgres{db: db}
}

func (r *RaitingSystemPostgres) UpRaiting(id int) error {
	return nil
}
