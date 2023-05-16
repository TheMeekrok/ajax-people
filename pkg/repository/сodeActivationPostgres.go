package repository

import (
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
)

type MailPostgres struct {
	db *sqlx.DB
}

func NewMailPostgres(db *sqlx.DB) *MailPostgres {
	return &MailPostgres{db: db}
}

func (r *MailPostgres) SendCodeActivation(id int, rdmKey string) (string, error) {
	var mail string

	query1 := fmt.Sprintf("UPDATE %s SET activation_code=$1 WHERE id=$2", userTable)
	row := r.db.QueryRow(query1, rdmKey, id)
	if err := row.Scan(&id); err != nil {
	}

	query2 := fmt.Sprintf("SELECT mail FROM %s WHERE id=$1", userTable)
	err := r.db.Get(&mail, query2, id)
	if err != nil {
		return "", err
	}

	return mail, nil
}

type CodeActivation struct {
	CodeActivation string `db:"activation_code"`
	IsVerificated  bool   `db:"is_verificated"`
}

func (r *MailPostgres) CheckCodeActivation(id int, rdmKey string) (bool, error) {
	var cdActv CodeActivation
	var verified bool

	query1 := fmt.Sprintf("SELECT activation_code, is_verificated FROM %s WHERE id=$1", userTable)
	err := r.db.Get(&cdActv, query1, id)
	if err != nil {
		return false, err
	}

	if cdActv.IsVerificated == true {
		err = errors.New("account already activated")
		return true, err
	}

	verified = cdActv.CodeActivation == rdmKey

	query2 := fmt.Sprintf("UPDATE %s SET is_verificated=$1 WHERE id=$2", userTable)
	r.db.Get(&cdActv.CodeActivation, query2, verified, id)

	return verified, err
}
