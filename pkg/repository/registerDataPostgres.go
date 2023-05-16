package repository

import (
	user "backend_ajax-people"
	"fmt"
	"github.com/jmoiron/sqlx"
)

type RegisterDataPostgres struct {
	db *sqlx.DB
}

func NewRegisterDataPostgres(db *sqlx.DB) *RegisterDataPostgres {
	return &RegisterDataPostgres{db: db}
}

func (r *RegisterDataPostgres) GetAllFaculties() ([]user.Faculty, error) {
	var faculties []user.Faculty

	query := fmt.Sprintf("SELECT * FROM %s", facultiesTable)
	if err := r.db.Select(&faculties, query); err != nil {
		return nil, err
	}

	return faculties, nil
}

func (r *RegisterDataPostgres) GetAllInterests() ([]user.Interest, error) {
	var interests []user.Interest

	query := fmt.Sprintf("SELECT * FROM %s", interestsTable)
	if err := r.db.Select(&interests, query); err != nil {
		return nil, err
	}

	return interests, nil
}

func (r *RegisterDataPostgres) GetAllSchools() ([]user.School, error) {
	var schools []user.School

	query := fmt.Sprintf("SELECT * FROM %s", schoolsTable)
	if err := r.db.Select(&schools, query); err != nil {
		return nil, err
	}

	return schools, nil
}
