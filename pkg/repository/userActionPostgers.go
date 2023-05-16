package repository

import (
	user "backend_ajax-people"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strconv"
	"strings"
)

type UserActionPostgres struct {
	db *sqlx.DB
}

func NewUserActionPostgres(db *sqlx.DB) *UserActionPostgres {
	return &UserActionPostgres{db: db}
}

func (r *UserActionPostgres) CreateUser(user user.User) (int, error) {
	var id int

	query := fmt.Sprintf("INSERT INTO %s (firstname, lastname, password, mail) values ($1, $2, $3, $4) RETURNING id", userTable)

	row := r.db.QueryRow(query, user.FirstName, user.LastName, user.Password, user.Mail)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *UserActionPostgres) GetUser(id int) (user.User, error) {
	var user user.User

	query := fmt.Sprintf("SELECT id,firstname, lastname,mail,age,status_user, education_level,study_program_id,school_id,avatar_path FROM %s WHERE id=$1", userTable)
	err := r.db.Get(&user, query, id)

	return user, err
}

func (r *UserActionPostgres) GetAllUsers() ([]user.User, error) {
	var userList []user.User

	query := fmt.Sprintf("SELECT id,firstname, lastname,mail,age,status_user, education_level,study_program_id,school_id,avatar_path FROM %s", userTable)
	if err := r.db.Select(&userList, query); err != nil {
		return nil, err
	}

	for i := 0; i < len(userList); i++ {
		query = fmt.Sprintf(`SELECT DISTINCT interest_id FROM %s
    								JOIN %s ON users.id = users_interests.user_id WHERE user_id = $1;`,
			userTable, usersInterests)
		if err := r.db.Select(&userList[i].Interests, query, userList[i].Id); err != nil {
			return nil, err
		}
	}

	return userList, nil
}

func (r *UserActionPostgres) DeleteUser(id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", userTable)
	_, err := r.db.Exec(query, id)
	return err
}

func (r *UserActionPostgres) UpdateUser(id int, user user.UpdateUserInput) error {
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if user.FirstName != nil {
		setValues = append(setValues, fmt.Sprintf("firstname=$%d", argId))
		args = append(args, *user.FirstName)
		argId++
	}

	if user.LastName != nil {
		setValues = append(setValues, fmt.Sprintf("lastname=$%d", argId))
		args = append(args, *user.LastName)
		argId++
	}

	if user.StatusUser != nil {
		setValues = append(setValues, fmt.Sprintf("status_user=$%d", argId))
		args = append(args, *user.StatusUser)
		argId++
	}

	if user.AdmissionYear != nil {
		setValues = append(setValues, fmt.Sprintf("admission_year=$%d", argId))
		args = append(args, *user.AdmissionYear)
		argId++
	}

	if user.Age != nil {
		setValues = append(setValues, fmt.Sprintf("age=$%d", argId))
		args = append(args, *user.Age)
		argId++
	}

	if user.EducationLevel != nil {
		setValues = append(setValues, fmt.Sprintf("education_level=$%d", argId))
		args = append(args, *user.EducationLevel)
		argId++
	}

	if user.GraduationYear != nil {
		setValues = append(setValues, fmt.Sprintf("graduation_year=$%d", argId))
		args = append(args, *user.GraduationYear)
		argId++
	}

	if user.StudyProgramId != nil {
		setValues = append(setValues, fmt.Sprintf("study_program_id=$%d", argId))
		args = append(args, *user.StudyProgramId)
		argId++
	}

	if user.SchoolId != nil {
		setValues = append(setValues, fmt.Sprintf("school_id=$%d", argId))
		args = append(args, *user.SchoolId)
		argId++
	}

	if user.AvatarPath != nil {
		setValues = append(setValues, fmt.Sprintf("avatar_path=$%d", argId))
		args = append(args, *user.AvatarPath)
		argId++
	}

	// добавление интересов
	var plug int

	for i := 0; i < len(user.IdsInterests); i++ {

		var interestExists bool
		query := fmt.Sprintf("SELECT EXISTS(SELECT id FROM %s WHERE user_id=$1 AND interest_id=$2)", usersInterests)
		_ = r.db.Get(&interestExists, query, id, user.IdsInterests[i])
		if interestExists {
			continue
		}

		query = fmt.Sprintf("INSERT INTO %s (user_id, interest_id) values ($1, $2) RETURNING id", usersInterests)

		row := r.db.QueryRow(query, id, user.IdsInterests[i])
		if err := row.Scan(&plug); err != nil {
			return err
		}
	}

	setQuery := strings.Join(setValues, ", ")

	if setQuery != "" {
		query := fmt.Sprintf("UPDATE %s SET %s WHERE id=$%d;", userTable, setQuery, argId)

		args = append(args, id)
		_, err := r.db.Exec(query, args...)
		return err

	}
	return nil
}

func (r *UserActionPostgres) SelectedDataUser(userSelect user.UpdateUserInput) ([]user.User, error) {
	var userList []user.User

	setInterests := make([]string, 0)
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if userSelect.FirstName != nil {
		setValues = append(setValues, fmt.Sprintf("firstname=$%d", argId))
		args = append(args, *userSelect.FirstName)
		argId++
	}

	if userSelect.LastName != nil {
		setValues = append(setValues, fmt.Sprintf("lastname=$%d", argId))
		args = append(args, *userSelect.LastName)
		argId++
	}

	if userSelect.StatusUser != nil {
		setValues = append(setValues, fmt.Sprintf("status_user=$%d", argId))
		args = append(args, *userSelect.StatusUser)
		argId++
	}

	if userSelect.AdmissionYear != nil {
		setValues = append(setValues, fmt.Sprintf("admission_year=$%d", argId))
		args = append(args, *userSelect.AdmissionYear)
		argId++
	}

	if userSelect.Age != nil {
		setValues = append(setValues, fmt.Sprintf("age=$%d", argId))
		args = append(args, *userSelect.Age)
		argId++
	}

	if userSelect.EducationLevel != nil {
		setValues = append(setValues, fmt.Sprintf("education_level=$%d", argId))
		args = append(args, *userSelect.EducationLevel)
		argId++
	}

	if userSelect.GraduationYear != nil {
		setValues = append(setValues, fmt.Sprintf("graduation_year=$%d", argId))
		args = append(args, *userSelect.GraduationYear)
		argId++
	}

	if userSelect.StudyProgramId != nil {
		setValues = append(setValues, fmt.Sprintf("study_program_id=$%d", argId))
		args = append(args, *userSelect.StudyProgramId)
		argId++
	}

	if userSelect.SchoolId != nil {
		setValues = append(setValues, fmt.Sprintf("school_id=$%d", argId))
		args = append(args, *userSelect.SchoolId)
		argId++
	}

	if userSelect.AvatarPath != nil {
		setValues = append(setValues, fmt.Sprintf("avatar_path=$%d", argId))
		args = append(args, *userSelect.AvatarPath)
		argId++
	}

	setQuery := strings.Join(setValues, " AND ")

	flag := false
	for i := 0; i < len(userSelect.IdsInterests); i++ {
		setInterests = append(setInterests, "users_interests.interest_id="+strconv.Itoa(userSelect.IdsInterests[i]))
		flag = true
	}

	if flag {
		setInterestsQuery := " AND ("
		setInterestsQuery += strings.Join(setInterests, " OR ")
		setInterestsQuery += ")"
		setQuery += setInterestsQuery

	}

	query := fmt.Sprintf(`SELECT DISTINCT users.id, firstname, lastname,mail,age,status_user, 
                				education_level,study_program_id,school_id,avatar_path 
								FROM %s JOIN %s ON users.id = users_interests.user_id
    							JOIN %s ON users_interests.interest_id = interest.id 
                                WHERE %s`, userTable, usersInterests, interestsTable, setQuery)

	if err := r.db.Select(&userList, query, args...); err != nil {
		return nil, err
	}

	for i := 0; i < len(userList); i++ {
		query = fmt.Sprintf(`SELECT DISTINCT interest_id FROM %s
    								JOIN %s ON users.id = users_interests.user_id WHERE user_id = $1;`,
			userTable, usersInterests)
		if err := r.db.Select(&userList[i].Interests, query, userList[i].Id); err != nil {
			return nil, err
		}
	}

	return userList, nil
}

func (r *UserActionPostgres) RequestСorrespondence(idSender int, emailRecipient, coincidenceTime string) (int, error) {
	var idRecipient int
	var idCoincidence int
	var requestExists bool

	query := fmt.Sprintf("SELECT id FROM %s WHERE mail=$1", userTable)
	err := r.db.Get(&idRecipient, query, emailRecipient)
	if err != nil {
		return 0, err
	}

	query = fmt.Sprintf("SELECT EXISTS(SELECT * FROM %s WHERE sendler_id=$1 AND recipient_id=$2)", coincidenceTable)
	err = r.db.Get(&requestExists, query, idSender, idRecipient)
	if err != nil || requestExists {
		return -1, err
	}

	query = fmt.Sprintf("INSERT INTO %s (sendler_id, recipient_id, coincidence_time) values ($1, $2, $3) RETURNING id", coincidenceTable)
	row := r.db.QueryRow(query, idSender, idRecipient, coincidenceTime)
	if err = row.Scan(&idCoincidence); err != nil {
		return 0, err
	}

	return idCoincidence, nil
}

func (r *UserActionPostgres) AcceptMessageRequest(idRequest int) error {

	query := fmt.Sprintf("UPDATE %s SET request_accepted=true WHERE id=$1;", coincidenceTable)
	_, err := r.db.Exec(query, idRequest)
	if err != nil {
		return err
	}

	return nil
}
