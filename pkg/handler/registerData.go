package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// Получение списка всех направлений подготовки
func (h *Handler) getAllFaculties(c *gin.Context) {
	facultiesList, err := h.services.GetAllFaculties()

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, facultiesList)
}

// Получение списка всех интересов
func (h *Handler) getAllInterests(c *gin.Context) {
	interestsList, err := h.services.GetAllInterests()

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, interestsList)
}

// Получение списка всех возможных состояний Пользователя
func (h *Handler) getAllStatuses(c *gin.Context) {
	c.JSON(http.StatusOK, h.services.GetAllStatuses())
}

// Получение списка всех возможных уровней обучения
func (h *Handler) getAllEdLevels(c *gin.Context) {
	c.JSON(http.StatusOK, h.services.GetAllEdLevels())
}

// Получение списка всех школ
func (h *Handler) getAllSchools(c *gin.Context) {
	schoolsList, err := h.services.GetAllSchools()

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, schoolsList)
}
