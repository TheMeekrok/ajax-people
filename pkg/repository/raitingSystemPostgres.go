package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

type RaitingSystemPostgres struct {
	db *sqlx.DB
}

func NewRaitingSystemPostgres(db *sqlx.DB) *RaitingSystemPostgres {
	return &RaitingSystemPostgres{db: db}
}

func (r *RaitingSystemPostgres) UpRaiting(userId, userReactedId, grade int) (bool, error) {
	var plug bool

	query := fmt.Sprintf(`SELECT EXISTS(SELECT * FROM %s WHERE user_with_reaction_id=$1  AND user_reaction_id=$2)`, evaluteRaiting)
	err := r.db.Get(&plug, query, userId, userReactedId)
	if err != nil {
		return false, err
	}
	var lastgrade int
	var raiting int
	query = fmt.Sprintf(`SELECT raiting FROM %s WHERE user_id=$1`, raitingUser)
	err = r.db.Get(&raiting, query, userId)
	if err != nil {
		return false, err
	}

	if !plug {
		query = fmt.Sprintf("INSERT INTO %s (user_with_reaction_id, user_reaction_id, reaction) values ($1, $2, $3) RETURNING id", evaluteRaiting)
		row := r.db.QueryRow(query, userId, userReactedId, grade)
		if err := row.Err(); err != nil {
			return false, err
		}
		raiting = raiting + grade
	} else {

		query = fmt.Sprintf(`SELECT reaction FROM %s WHERE user_reaction_id=$1 AND user_with_reaction_id=$2`, evaluteRaiting)
		err = r.db.Get(&lastgrade, query, userReactedId, userId)
		if err != nil {
			return false, err
		}

		query = fmt.Sprintf(`UPDATE %s SET reaction=$1 WHERE user_with_reaction_id=$2 AND user_reaction_id=$3`, evaluteRaiting)
		_, err = r.db.Exec(query, grade, userId, userReactedId)
		if err != nil {
			return false, err
		}

		raiting = raiting + (2 * grade)
	}

	if lastgrade != grade {
		query = fmt.Sprintf(`UPDATE %s SET raiting=$1 WHERE user_id=$2`, raitingUser)
		_, err = r.db.Exec(query, raiting, userId)
		if err != nil {
			return false, err
		}
		return true, nil
	}

	return false, nil
}

func (r *RaitingSystemPostgres) GetRating(userId, userReacredId int) (int, error) {

	var reaction int
	query := fmt.Sprintf(`SELECT reaction FROM %s WHERE user_with_reaction_id=$1 AND user_reaction_id=$2 `, evaluteRaiting)
	err := r.db.Get(&reaction, query, userId, userReacredId)
	if err != nil {
		return 0, err
	}

	return reaction, nil
}
