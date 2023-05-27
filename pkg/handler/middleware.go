package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

const (
	authorizationHeader = "Authorization"
	userCtx             = "userId"
)

func checkAdmin(h *Handler, c *gin.Context) bool {
	token, err := c.Cookie("jwtToken")
	if err != nil {
		return false
	}

	_, isAdmin, _, err := h.services.ParseToken(token)
	if err != nil {
		return false
	}

	return isAdmin
}

func getJWT(h *Handler, c *gin.Context) (int, bool, bool, error) {
	token, err := c.Cookie("jwtToken")
	if err != nil {
		return 0, false, false, err
	}

	userId, isAdmin, isVerificated, err := h.services.ParseToken(token)
	if err != nil {
		return 0, false, false, err
	}

	return userId, isAdmin, isVerificated, nil
}

func (h *Handler) userIdentify(c *gin.Context) {
	_, _, isVerificated, err := getJWT(h, c)
	if err != nil || !isVerificated {
		newErrorResponse(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
}

func (h *Handler) userIdentifyById(c *gin.Context) {
	userId, _, _, _ := getJWT(h, c)
	getId, err := getUserId(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if userId != getId {
		if getId == 0 {
			return
		}
		newErrorResponse(c, http.StatusForbidden, "Forbidden")
		return
	}

}

func (h *Handler) userIdentifyAdmin(c *gin.Context) {
	if checkAdmin(h, c) == false {
		newErrorResponse(c, http.StatusForbidden, "Forbidden")
		return
	}
}

func getUserId(c *gin.Context) (int, error) {

	str := c.Param("id")

	if str == "" {
		return 0, nil
	}
	id, err := strconv.Atoi(str)
	if err != nil {
		return 0, err
	}

	return id, nil
}
