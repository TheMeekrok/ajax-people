package repository

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/nfnt/resize"
	"image"
	"image/jpeg"
	"image/png"
	"io/ioutil"
)

type UploadInput struct {
	File        []byte
	Name        string
	Size        int64
	ContentType string
}

type FileStorage struct {
	db *sqlx.DB
}

func NewFileStorage(db *sqlx.DB) *FileStorage {
	return &FileStorage{
		db: db,
	}
}

func (r FileStorage) Upload(id int, input UploadInput) (string, error) {
	var fileName string
	pathDir := "assets/avatars"
	buf := new(bytes.Buffer)
	image, _, _ := image.Decode(bytes.NewReader(input.File))
	newImage := resize.Resize(480, 0, image, resize.Lanczos3)

	switch input.ContentType {
	case "image/jpeg":
		fileName = input.Name + ".jpeg"

		if err := jpeg.Encode(buf, newImage, nil); err != nil {
			return "", err
		}

	case "image/png":
		if err := png.Encode(buf, newImage); err != nil {
			return "", err
		}

		fileName = input.Name + ".png"
	}

	tempFile, err := ioutil.TempFile(pathDir, "*"+fileName)
	if err != nil {
		fmt.Println(err)
	}
	defer tempFile.Close()

	imageBytes := buf.Bytes()
	tempFile.Write(imageBytes)
	query := fmt.Sprintf("UPDATE %s SET avatar_path=$1 WHERE id=$2;", userTable)

	_, err = r.db.Exec(query, tempFile.Name(), id)
	if err != nil {
		return "", err
	}

	return tempFile.Name(), nil
}

func (r FileStorage) GetAvatar(id int) (string, error) {
	var avatarPath string

	query := fmt.Sprintf(`SELECT avatar_path FROM %s WHERE id=$1`, userTable)
	err := r.db.Get(&avatarPath, query, id)
	if err != nil {
		return "", err
	}
	if avatarPath == "" {
		return "no image", nil
	}

	dataBytes, err := ioutil.ReadFile(avatarPath)
	if err != nil {
		return "", err
	}

	encoded := base64.StdEncoding.EncodeToString(dataBytes)

	return encoded, nil
}
