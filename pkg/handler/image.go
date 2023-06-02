package handler

import (
	"errors"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
)

const MAX_UPLOAD_SIZE = 80 << 20

var IMAGE_TYPES = map[string]interface{}{
	"image/jpeg": nil,
	"image/png":  nil,
}

func (h *Handler) uploadAvatar(c *gin.Context) {
	userId, _, _, _ := getJWT(h, c)

	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MAX_UPLOAD_SIZE)

	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	defer file.Close()

	fileClone := file
	fileBytes, err := ioutil.ReadAll(fileClone)

	fileType := http.DetectContentType(fileBytes)

	if _, ex := IMAGE_TYPES[fileType]; !ex {
		err = errors.New("file type is not supported")
		newErrorResponse(c, http.StatusBadRequest, err.Error())
	}

	path, err := h.services.Upload(userId, fileBytes, fileHeader.Size, fileType)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
	}

	c.JSON(http.StatusOK, path)

}

func (h *Handler) getAvatar(c *gin.Context) {
	userId, _ := getUserId(c)

	fileBase64, _ := h.services.GetAvatar(userId)

	if fileBase64 == "no image" {
		newResponse(c, http.StatusNoContent, fileBase64)
		return
	}

	c.JSON(http.StatusOK, fileBase64)
}
