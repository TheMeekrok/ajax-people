package repository

import (
	user "backend_ajax-people"
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
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
	var id, ids int

	query := fmt.Sprintf("INSERT INTO %s (firstname, lastname, password, mail) values ($1, $2, $3, $4) RETURNING id", userTable)
	row := r.db.QueryRow(query, user.FirstName, user.LastName, user.Password, user.Mail)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	query = fmt.Sprintf("INSERT INTO %s (user_id) values ($1) RETURNING id", personalData)
	row = r.db.QueryRow(query, id)
	if err := row.Scan(ids); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *UserActionPostgres) GetUser(id int) (user.UserOutput, error) {
	var user user.UserOutput

	query := fmt.Sprintf(`SELECT id,firstname, lastname,age,status_user, education_level,
       								study_program_id,is_admin,school_id, admission_year, graduation_year
									FROM %s WHERE id=$1`, userTable)
	err := r.db.Get(&user, query, id)

	for i := 0; i < 1; i++ {
		query = fmt.Sprintf(`SELECT DISTINCT interest_id FROM %s
    								JOIN %s ON users.id = users_interests.user_id WHERE user_id = $1;`,
			userTable, usersInterests)
		if err := r.db.Select(&user.Interests, query, user.Id); err != nil {
			return user, err
		}

		query = fmt.Sprintf(`SELECT DISTINCT telegram, vk, telephone FROM %s
    								JOIN %s ON users.id = personal_data.user_id WHERE user_id = $1;`,
			userTable, personalData)

		if err := r.db.Get(&user.PersonalData, query, user.Id); err != nil {
			return user, err
		}

	}
	return user, err
}

func (r *UserActionPostgres) GetAllUsers(page, items int) ([]user.UserOutput, error) {
	var userListPage []user.UserOutput
	var userList []user.UserOutput

	var query string
	query = fmt.Sprintf(`SELECT users.id ,firstname, mail, lastname ,is_admin,is_moderated, raiting 
								FROM %s JOIN %s r on users.id = r.user_id WHERE firstname!=''
								ORDER BY raiting DESC`, userTable, raitingUser)

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

		query = fmt.Sprintf(`SELECT DISTINCT telegram, vk, telephone FROM %s
    								JOIN %s ON users.id = personal_data.user_id WHERE user_id = $1;`,
			userTable, personalData)

		if err := r.db.Get(&userList[i].PersonalData, query, userList[i].Id); err != nil {
			return nil, err
		}

	}

	if page == -1 || items == 0 {
		return userList, nil
	}

	var lastItems int
	if page*items+items-len(userList) > 0 && items-((page*items)+items-len(userList)) <= 0 {
		return userListPage, nil
	} else if page*items+items > len(userList) {
		lastItems = items - ((page * items) + items - len(userList))
	} else {
		lastItems = items
	}

	for i := page * items; i < page*items+lastItems; i++ {
		userListPage = append(userListPage, userList[i])
	}

	return userListPage, nil
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

	setValuesPer := make([]string, 0)
	argsPer := make([]interface{}, 0)
	argIdPer := 1

	if user.Telegram != nil {
		setValuesPer = append(setValuesPer, fmt.Sprintf("telegram=$%d", argIdPer))
		argsPer = append(argsPer, *user.Telegram)
		argIdPer++
	}

	if user.Vk != nil {
		setValuesPer = append(setValuesPer, fmt.Sprintf("vk=$%d", argIdPer))
		argsPer = append(argsPer, *user.Vk)
		argIdPer++
	}
	if user.Telephone != nil {
		setValuesPer = append(setValuesPer, fmt.Sprintf("telephone=$%d", argIdPer))
		argsPer = append(argsPer, *user.Telephone)
		argIdPer++
	}

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
	// отчистка интресов для новых
	if len(user.IdsInterests) > 0 {
		query := fmt.Sprintf(`DELETE FROM %s WHERE user_id=$1`, usersInterests)
		_, err := r.db.Exec(query, id)
		if err != nil {
			logrus.Println("trublllll")
		}
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
	setQueryPer := strings.Join(setValuesPer, ", ")

	if setQueryPer != "" {
		query := fmt.Sprintf("UPDATE %s SET %s WHERE user_id=$%d;", personalData, setQueryPer, argIdPer)

		argsPer = append(argsPer, id)
		_, err := r.db.Exec(query, argsPer...)
		if err != nil {
			return err
		}
	}

	if setQuery != "" {
		query := fmt.Sprintf("UPDATE %s SET %s WHERE id=$%d;", userTable, setQuery, argId)

		args = append(args, id)
		_, err := r.db.Exec(query, args...)
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *UserActionPostgres) SelectedDataUser(userSelect user.UpdateUserInput, idUser, page, items int) ([]user.UserOutput, error) {
	var userListPage []user.UserOutput
	var userList []user.UserOutput
	var setInterestsQuery string
	setInterests := make([]string, 0)
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if userSelect.Id != nil && *userSelect.Id != 0 {
		setValues = append(setValues, fmt.Sprintf("users.id=$%d", argId))
		args = append(args, *userSelect.Id)
		argId++
	}

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

	if userSelect.StatusUser != nil && *userSelect.StatusUser != 0 {
		setValues = append(setValues, fmt.Sprintf("status_user=$%d", argId))
		args = append(args, *userSelect.StatusUser)
		argId++
	}

	if userSelect.AdmissionYear != nil && *userSelect.AdmissionYear != 0 {
		setValues = append(setValues, fmt.Sprintf("admission_year=$%d", argId))
		args = append(args, *userSelect.AdmissionYear)
		argId++
	}

	if userSelect.Age != nil && *userSelect.Age != 0 {
		setValues = append(setValues, fmt.Sprintf("age=$%d", argId))
		args = append(args, *userSelect.Age)
		argId++
	}

	if userSelect.EducationLevel != nil && *userSelect.EducationLevel != 0 {
		setValues = append(setValues, fmt.Sprintf("education_level=$%d", argId))
		args = append(args, *userSelect.EducationLevel)
		argId++
	}

	if userSelect.GraduationYear != nil && *userSelect.GraduationYear != 0 {
		setValues = append(setValues, fmt.Sprintf("graduation_year=$%d", argId))
		args = append(args, *userSelect.GraduationYear)
		argId++
	}

	if userSelect.StudyProgramId != nil && *userSelect.StudyProgramId != 0 {
		setValues = append(setValues, fmt.Sprintf("study_program_id=$%d", argId))
		args = append(args, *userSelect.StudyProgramId)
		argId++
	}

	if userSelect.SchoolId != nil && *userSelect.SchoolId != 0 {
		setValues = append(setValues, fmt.Sprintf("school_id=$%d", argId))
		args = append(args, *userSelect.SchoolId)
		argId++
	}

	if idUser != 0 && idUser != *userSelect.Id {
		setValues = append(setValues, fmt.Sprintf("users.id!=$%d", argId))
		args = append(args, idUser)
		argId++
	}

	setQuery := strings.Join(setValues, " AND ")

	flag := false
	for i := 0; i < len(userSelect.IdsInterests); i++ {
		setInterests = append(setInterests, "users_interests.interest_id="+strconv.Itoa(userSelect.IdsInterests[i]))
		flag = true
	}

	if flag {
		if setQuery != "" {
			setInterestsQuery += " AND "
		}
		setInterestsQuery += "("
		setInterestsQuery += strings.Join(setInterests, " OR ")
		setInterestsQuery += ")"
		setQuery += setInterestsQuery
	}
	var query string
	if setQuery == "" {
		query = fmt.Sprintf(`SELECT users.id ,firstname, mail, lastname,age,status_user, education_level,
								study_program_id,is_admin,school_id, admission_year, graduation_year, raiting 
								FROM %s JOIN %s r on users.id = r.user_id
								WHERE is_verificated=true AND is_moderated=false AND firstname!='' ORDER BY raiting DESC`, userTable, raitingUser)
	} else {
		query = fmt.Sprintf(`SELECT DISTINCT users.id, firstname, mail, lastname,age,status_user, 
                				education_level,study_program_id,school_id,is_admin, admission_year, graduation_year, raiting
								FROM %s JOIN %s ON users.id = users_interests.user_id
    							JOIN %s ON users_interests.interest_id = interest.id 
								JOIN %s r on users.id = r.user_id
                                WHERE is_verificated = true AND is_moderated=false AND firstname!='' AND %s ORDER BY raiting DESC`, userTable, usersInterests, interestsTable, raitingUser, setQuery)
	}

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

		query = fmt.Sprintf(`SELECT DISTINCT telegram, vk, telephone FROM %s
    								JOIN %s ON users.id = personal_data.user_id WHERE user_id = $1;`,
			userTable, personalData)

		if err := r.db.Get(&userList[i].PersonalData, query, userList[i].Id); err != nil {
			return nil, err
		}

	}

	if page == -1 || items == 0 {
		return userList, nil
	}

	var lastItems int
	if page*items+items-len(userList) > 0 && items-((page*items)+items-len(userList)) <= 0 {
		return userListPage, nil
	} else if page*items+items > len(userList) {
		lastItems = items - ((page * items) + items - len(userList))
	} else {
		lastItems = items
	}

	for i := page * items; i < page*items+lastItems; i++ {
		userListPage = append(userListPage, userList[i])
	}

	return userListPage, nil
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

func (r *UserActionPostgres) ChangeUserOnAdmin(id int, isAdmin bool) error {

	query := fmt.Sprintf("UPDATE %s SET is_admin=$1 WHERE id=$2;", userTable)
	_, err := r.db.Exec(query, isAdmin, id)
	if err != nil {
		return err
	}

	return nil

}

func (r *UserActionPostgres) BanUser(id int, isBan bool) error {

	query := fmt.Sprintf("UPDATE %s SET is_moderated=$1 WHERE id=$2;", userTable)
	_, err := r.db.Exec(query, isBan, id)
	if err != nil {
		return err
	}

	return nil

}
