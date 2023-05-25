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
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}

type EducationLevel struct {
	Id    int    `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}
