package user

type Interest struct {
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}

type Faculty struct {
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}

type StatusUser struct {
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}

type School struct {
	Id        int    `json:"id" db:"id"`
	Title     string `json:"title" db:"title"`
	FullTitle string `json:"fullTitle" db:"full_title"`
}

type EducationLevel struct {
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}
