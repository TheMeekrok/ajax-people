package service

import (
	"backend_ajax-people/pkg/repository"
	"fmt"
	"github.com/gookit/color"
	"math/rand"
	"net/smtp"
	"time"
)

type SendMessageService struct {
	repo repository.Mail
}

func NewSendMessageService(repo repository.Mail) *SendMessageService {
	return &SendMessageService{repo: repo}
}

func (s SendMessageService) SendCodeActivation(id int) error {
	rand.Seed(time.Now().UnixNano())
	rmdKey := (randomString(6))

	to, err := s.repo.SendCodeActivation(id, rmdKey)
	if err != nil {
		return err
	}

	addr := "smtp.mail.ru:587"
	host := "smtp.mail.ru"
	from := "ajax-people@mail.ru"
	password := "EKgDHrLfHdPMpyT622dX"
	subject := "Активации аккаунта"
	template := fmt.Sprintf(color.Green.Sprint("%s")+", "+
		"Это сообщение содержит код активации для активации вашего аккаунта ajax-people."+"\r\n"+
		"Для завершения процесса активации вам необходимо ввести этот код в соответствующее поле на странице регистрации. "+"\r\n"+"\r\n"+
		"Код активации: %s"+"\r\n"+"\r\n"+
		"Если вы не регистрировались в ajax-people просто проигнорируйте это сообщение "+"\r\n\r\n"+
		"С уважением,\r\n"+
		"Команда ajax-people", to, rmdKey)

	msg := "To: " + to + "\r\n" +
		"From: " + from + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" + template

	auth := smtp.PlainAuth("", from, password, host)
	err = smtp.SendMail(addr, auth, from, []string{to}, []byte(msg))
	if err != nil {
		return err
	}

	return nil

}
func (s SendMessageService) CheckCodeActivation(id int, rdmKey string) (bool, error) {
	return s.repo.CheckCodeActivation(id, rdmKey)
}

func randInt(min int, max int) int {
	return min + rand.Intn(max-min)
}

func randomString(l int) string {
	bytes := make([]byte, l)
	for i := 0; i < l; i++ {
		if randInt(1, 3) == 1 {
			bytes[i] = byte(randInt(65, 90))
		} else {
			bytes[i] = byte(randInt(48, 57))
		}
	}
	return string(bytes)
}
