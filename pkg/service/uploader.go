package service

import (
	"backend_ajax-people/pkg/repository"
	"fmt"
	"math/rand"
	"time"
)

const (
	letterBytes      = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASFDGHJKLZXCVBNM"
	fileNameLenght   = 16
	timeFormatUpload = "2006-01-02_15-04-05"
)

type UploaderService struct {
	repo repository.FileStorageImage
}

func NewUploaderService(repo repository.FileStorageImage) *UploaderService {
	return &UploaderService{repo: repo}
}

func (s UploaderService) Upload(id int, file []byte, size int64, contextType string) (string, error) {

	return s.repo.Upload(id, repository.UploadInput{
		File:        file,
		Name:        s.generateFileName(),
		Size:        size,
		ContentType: contextType,
	})

}

func (s UploaderService) GetAvatar(id int) (string, error) {
	return s.repo.GetAvatar(id)
}

func (s UploaderService) generateFileName() string {
	b := make([]byte, fileNameLenght)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	uploadTime := fmt.Sprintf(time.Now().Format(timeFormatUpload))

	return string(b) + "_" + uploadTime
}
