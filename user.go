package user

import "errors"

type User struct {
	Id               int    `json:"-" db:"id"`
	FirstName        string `json:"firstName"`
	Mail             string `json:"mail" binding:"required"`
	Password         string `json:"password" binding:"required"`
	Interests        []int  `json:"interests"`
	LastName         string `json:"lastName"`
	Age              int    `json:"age"`
	StatusUserId     int    `json:"statusUserId" db:"status_user"`
	EducationLevelId int    `json:"educationLevelId" db:"education_level"`
	StudyProgramId   int    `json:"studyProgramId" db:"study_program_id"`
	SchoolId         int    `json:"schoolId" db:"school_id"`
	AdmissionYear    string `json:"admissionYear"`
	GraduationYear   string `json:"graduationYear"`
	IsAdmin          bool   `json:"isAdmin" db:"is_admin"`
	IsVerificated    bool   `json:"isVerificated" db:"is_verificated"`
	IsVisible        bool   `json:"isVisible"`
	AvatarPath       string `json:"avatarPath" db:"avatar_path"`
	IsModerated      bool   `json:"isModerated"`
}

type UpdateUserInput struct {
	IdsInterests   []int   `json:"idInterests"`
	FirstName      *string `json:"firstName"`
	LastName       *string `json:"lastName"`
	Age            *int    `json:"age"`
	StatusUser     *string `json:"statusUser"`
	EducationLevel *string `json:"educationLevel"`
	StudyProgramId *int    `json:"studyProgramId"`
	SchoolId       *int    `json:"schoolId"`
	AdmissionYear  *string `json:"admissionYear"`
	GraduationYear *string `json:"graduationYear"`
	AvatarPath     *string `json:"avatarPath"`
}

func (i UpdateUserInput) Validate() error {
	if i.FirstName == nil && i.LastName == nil && i.Age == nil && i.StatusUser == nil &&
		i.EducationLevel == nil && i.StudyProgramId == nil && i.SchoolId == nil &&
		i.AdmissionYear == nil && i.GraduationYear == nil && i.AvatarPath == nil {
		return errors.New("update structure has no values")
	}

	return nil
}
