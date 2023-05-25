package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// Получение списка всех направлений подготовки
func (h *Handler) getAllFaculties(c *gin.Context) {
	id, _ := strconv.Atoi(c.Query("id"))

	facultiesList, err := h.services.GetAllFaculties(id)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, facultiesList)
}

// Получение списка всех интересов
func (h *Handler) getAllInterests(c *gin.Context) {
	id, _ := strconv.Atoi(c.Query("id"))

	interestsList, err := h.services.GetAllInterests(id)

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, interestsList)
}

// Получение списка всех возможных состояний Пользователя
func (h *Handler) getAllStatuses(c *gin.Context) {
	id, _ := strconv.Atoi(c.Query("id"))

	c.JSON(http.StatusOK, h.services.GetAllStatuses(id))
}

// Получение списка всех возможных уровней обучения
func (h *Handler) getAllEdLevels(c *gin.Context) {
	id, _ := strconv.Atoi(c.Query("id"))

	c.JSON(http.StatusOK, h.services.GetAllEdLevels(id))
}

// Получение списка всех школ
func (h *Handler) getAllSchools(c *gin.Context) {
	id, _ := strconv.Atoi(c.Query("id"))

	schoolsList, err := h.services.GetAllSchools(id)

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, schoolsList)
}
