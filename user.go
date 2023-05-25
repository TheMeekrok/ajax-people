package user

import "errors"

type User struct {
	Id               int          `json:"-" db:"id"`
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
	AdmissionYear    int          `json:"admissionYear"`
	GraduationYear   int          `json:"graduationYear"`
	IsAdmin          bool         `json:"isAdmin" db:"is_admin"`
	IsVerificated    bool         `json:"isVerificated" db:"is_verificated"`
	IsVisible        bool         `json:"isVisible"`
	AvatarPath       string       `json:"avatarPath" db:"avatar_path"`
	IsModerated      bool         `json:"isModerated"`
	PersonalData     PersonalData `json:"personalData"`
}

type PersonalData struct {
	Telegram  string `json:"telegram" db:"telegram"`
	Vk        string `json:"vk" db:"vk"`
	Telephone string `json:"telephone" db:"telephone"`
}

type UpdateUserInput struct {
	Id             *int    `json:"id"`
	IdsInterests   []int   `json:"idInterests"`
	FirstName      *string `json:"firstName"`
	LastName       *string `json:"lastName"`
	Age            *int    `json:"age"`
	StatusUser     *int    `json:"statusUser"`
	EducationLevel *int    `json:"educationLevel"`
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
