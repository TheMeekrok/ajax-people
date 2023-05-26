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

func (r *RegisterDataPostgres) GetAllFaculties(id int) ([]user.Faculty, error) {
	var faculties []user.Faculty

	var query string
	if id == 0 {
		query = fmt.Sprintf("SELECT * FROM %s", facultiesTable)
		if err := r.db.Select(&faculties, query); err != nil {
			return nil, err
		}
	} else {
		query = fmt.Sprintf("SELECT * FROM %s WHERE id=$1", facultiesTable)
		if err := r.db.Select(&faculties, query, id); err != nil {
			return nil, err
		}
	}

	return faculties, nil
}

func (r *RegisterDataPostgres) GetAllInterests(id int) ([]user.Interest, error) {
	var interests []user.Interest

	var query string
	if id == 0 {
		query = fmt.Sprintf("SELECT * FROM %s", interestsTable)
		if err := r.db.Select(&interests, query); err != nil {
			return nil, err
		}

	} else {
		query = fmt.Sprintf("SELECT * FROM %s WHERE id=$1", interestsTable)
		if err := r.db.Select(&interests, query, id); err != nil {
			return nil, err
		}

	}

	return interests, nil
}

func (r *RegisterDataPostgres) GetAllSchools(id int) ([]user.School, error) {
	var schools []user.School

	var query string
	if id == 0 {
		query = fmt.Sprintf("SELECT * FROM %s", schoolsTable)
		if err := r.db.Select(&schools, query); err != nil {
			return nil, err
		}
	} else {
		query = fmt.Sprintf("SELECT * FROM %s WHERE id=$1", schoolsTable)
		if err := r.db.Select(&schools, query, id); err != nil {
			return nil, err
		}
	}

	return schools, nil
}
