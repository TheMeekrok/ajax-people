package handler

import (
	user "backend_ajax-people"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

// Посты

// Получить пост по id
func (h *Handler) getPostById(c *gin.Context) {
	var postId int

	postId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	post, err := h.services.GetPostById(postId)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, post)
}

// Получить все посты
//func (h *Handler) getAllPosts(c *gin.Context) {
//	var filter user.PostFilter
//	if err := c.BindJSON(&filter); err != nil {
//		newErrorResponse(c, http.StatusBadRequest, err.Error())
//		return
//	}
//
//	idUser, isAdmin, _, _ := getJWT(h, c)
//
//	postsList, err := h.services.GetAllPosts(filter, isAdmin, idUser)
//	if err != nil {
//		newErrorResponse(c, http.StatusInternalServerError, err.Error())
//		return
//	}
//
//	c.JSON(http.StatusOK, postsList)
//}

func (h *Handler) getPostsByPage(c *gin.Context) {
	var postPage int
	var postQuantity int

	//var filter user.PostFilter

	idUser, isAdmin, _, _ := getJWT(h, c)

	var filter user.PostFilter
	postPage, _ = strconv.Atoi(c.Query("page"))
	postQuantity, _ = strconv.Atoi(c.Query("items"))
	orderBy, _ := strconv.Atoi(c.Query("orderBy"))
	filter.OrderBy = user.OrderType(orderBy)
	tags := strings.Split(c.Query("tags"), `,`)
	for _, s := range tags {
		num, err := strconv.Atoi(s)
		if err == nil {
			filter.TagsList = append(filter.TagsList, num)
		}
	}

	//fmt.Println(postPage, postQuantity, orderBy, tags)

	postsList, err := h.services.GetPostByPage(filter, postPage-1, postQuantity, isAdmin, idUser)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(postsList)

	c.JSON(http.StatusOK, postsList)

}

type PostInput struct {
	Text string `json:"text" binding:"required"`
	Tags []int  `json:"tags" binding:"required"`
}

// Создать новый пост
func (h *Handler) createPost(c *gin.Context) {
	var input PostInput

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "Failed to create a post")
		return
	}

	userId, _, _, err := getJWT(h, c)
	if err != nil {
		return
	}

	id, err := h.services.CreatePost(input.Text, input.Tags, userId)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, "Failed data: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type postUpdateInput struct {
	IsModerated bool `json:"isModerated" binding:"required"`
}

// Обновить пост (модерировать)
func (h *Handler) updatePost(c *gin.Context) {
	postId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var input postUpdateInput
	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "Failed to modify post")
		return
	}

	if err := h.services.UpdatePost(postId, input.IsModerated); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "OK")
}

// Удалить пост
func (h *Handler) deletePost(c *gin.Context) {
	postId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	err = h.services.DeletePost(postId)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "OK")
}

// Тэги

// Получить тэг по id
func (h *Handler) getTagById(c *gin.Context) {
	var tagId int

	tagId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	tag, err := h.services.GetTagById(tagId)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, tag)
}

// Получить все тэги
func (h *Handler) getAllTags(c *gin.Context) {
	tagsList, err := h.services.GetAllTags()
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, tagsList)
}

type TagInput struct {
	Title string `json:"title" binding:"required"`
}

// Создать новый  тэг
func (h *Handler) createTag(c *gin.Context) {
	var input TagInput

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "Failed to create a tag")
		return
	}

	id, err := h.services.CreateTag(input.Title)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

// Удалить тэг
func (h *Handler) deleteTag(c *gin.Context) {
	tagId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	err = h.services.DeleteTag(tagId)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "OK")
}
