package user

import "errors"

type User struct {
	Id               int          `json:"id" db:"id"`
	FirstName        string       `json:"firstName"`
	Mail             string       `json:"mail" binding:"required"`
	Password         string       `json:"password" binding:"required"`
	Interests        []int        `json:"interests"`
	LastName         string       `json:"lastName"`
	Age              int          `json:"age"`
	StatusUserId     int          `json:"statusUserId" db:"status_user"`
	EducationLevelId int          `json:"educationLevelId" db:"education_level"`
	StudyProgramId   int          `json:"studyProgramId" db:"study_program_id"`
	SchoolId         int          `json:"schoolId" db:"school_id"`
	AdmissionYear    int          `json:"admissionYear" db:"admission_year"`
	GraduationYear   int          `json:"graduationYear" db:"graduation_year"`
	IsAdmin          bool         `json:"isAdmin" db:"is_admin"`
	IsVerificated    bool         `json:"isVerificated" db:"is_verificated"`
	IsVisible        bool         `json:"isVisible"`
	AvatarPath       string       `json:"avatarPath" db:"avatar_path"`
	IsModerated      bool         `json:"isModerated" db:"is_moderated"`
	PersonalData     PersonalData `json:"personalData"`
}

type UserOutput struct {
	Id               int          `json:"id" db:"id"`
	FirstName        string       `json:"firstName"`
	Interests        []int        `json:"interests"`
	LastName         string       `json:"lastName"`
	Age              int          `json:"age"`
	Mail             string       `json:"mail" db:"mail"`
	StatusUserId     int          `json:"statusUserId" db:"status_user"`
	EducationLevelId int          `json:"educationLevelId" db:"education_level"`
	StudyProgramId   int          `json:"studyProgramId" db:"study_program_id"`
	SchoolId         int          `json:"schoolId" db:"school_id"`
	AdmissionYear    int          `json:"admissionYear" db:"admission_year"`
	GraduationYear   int          `json:"graduationYear" db:"graduation_year"`
	IsModerated      bool         `json:"isModerated" db:"is_moderated"`
	IsAdmin          bool         `json:"isAdmin" db:"is_admin"`
	PersonalData     PersonalData `json:"personalData"`
	Rating           int          `json:"rating" db:"raiting"`
}

type PersonalData struct {
	Telegram  string `json:"telegram" db:"telegram"`
	Vk        string `json:"vk" db:"vk"`
	Telephone string `json:"telephone" db:"telephone"`
}

type UpdateUserInput struct {
	Id             *int    `json:"id"`
	IdsInterests   []int   `json:"interests"`
	FirstName      *string `json:"firstName"`
	LastName       *string `json:"lastName"`
	Age            *int    `json:"age"`
	StatusUser     *int    `json:"statusUserId"`
	EducationLevel *int    `json:"educationLevelId"`
	StudyProgramId *int    `json:"studyProgramId"`
	SchoolId       *int    `json:"schoolId"`
	AdmissionYear  *int    `json:"admissionYear"`
	GraduationYear *int    `json:"graduationYear"`
	AvatarPath     *string `json:"avatarPath"`
	Telegram       *string `json:"telegram" db:"telegram"`
	Vk             *string `json:"vk" db:"vk"`
	Telephone      *string `json:"telephone" db:"telephone"`
}

func (i UpdateUserInput) Validate() error {
	if i.FirstName == nil && i.LastName == nil && i.Age == nil && i.StatusUser == nil &&
		i.EducationLevel == nil && i.StudyProgramId == nil && i.SchoolId == nil &&
		i.AdmissionYear == nil && i.GraduationYear == nil && i.AvatarPath == nil {
		return errors.New("update structure has no values")
	}

	return nil
}
