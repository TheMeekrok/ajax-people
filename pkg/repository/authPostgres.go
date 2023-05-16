package repository

import (
	user "backend_ajax-people"
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (r *AuthPostgres) CreateUser(user user.User) (int, error) {
	var id int
	var userExists bool

	query := fmt.Sprintf("SELECT EXISTS(SELECT * FROM %s WHERE mail=$1)", userTable)
	err := r.db.Get(&userExists, query, user.Mail)
	if err != nil || userExists {
		err = errors.New("this email already exists")
		return 0, err
	}

	query = fmt.Sprintf("INSERT INTO %s (firstname, lastname, password, mail) values ($1, $2, $3, $4) RETURNING id", userTable)

	row := r.db.QueryRow(query, user.FirstName, user.LastName, user.Password, user.Mail)
	fmt.Println(user.Mail)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}
	return id, nil

}

func (r *AuthPostgres) GetUser(email, password string) (user.User, error) {
	var user user.User

	query := fmt.Sprintf("SELECT id, is_admin, is_verificated FROM %s WHERE mail=$1 AND password=$2", userTable)
	err := r.db.Get(&user, query, email, password)

	return user, err
}
