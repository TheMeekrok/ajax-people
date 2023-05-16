package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

const (
	userTable        = "users"
	facultiesTable   = "faculty"
	interestsTable   = "interest"
	schoolsTable     = "school"
	postsTable       = "post"
	tagsTable        = "tag"
	postsTagsTable   = "posts_tags"
	coincidenceTable = "coincidence"
	usersInterests   = "users_interests"
)

func NewPostgresDB(cfg Config) (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.Username, cfg.DBName, cfg.Password, cfg.SSLMode))
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}
