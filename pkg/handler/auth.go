package handler

import (
	user "backend_ajax-people"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (h *Handler) signUp(c *gin.Context) {
	var input user.User

	if err := c.BindJSON(&input); err != nil {
		fmt.Printf("Failed to create a user: %s\n", err.Error())
		c.JSON(http.StatusBadRequest, "Failed to create a user")
		return
	}

	id, err := h.services.Authorization.CreateUser(input)
	if err != nil {
		fmt.Printf("Failed data: %s\n", err.Error())
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	err = h.services.SendCodeActivation(id)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type signInInput struct {
	Email    string `json:"mail" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) signIn(c *gin.Context) {
	var input signInInput

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := h.services.Authorization.GenerateToken(input.Email, input.Password)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	cookie, err := c.Cookie("jwtToken")

	if err != nil {
		cookie = "NotSet"
		c.SetCookie("jwtToken", token, 3600, "/", "localhost", false, true)
	}

	fmt.Printf("Cookie value: %s \n", cookie)

	c.JSON(http.StatusOK, map[string]interface{}{
		"token": token,
	})
}

func (h *Handler) signOut(c *gin.Context) {
	c.SetCookie("jwtToken", "", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, "ok")
}
