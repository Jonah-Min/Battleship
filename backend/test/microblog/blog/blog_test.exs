defmodule Microblog.BlogTest do
  use Microblog.DataCase

  alias Microblog.Blog
  describe "users" do
    alias Microblog.Blog.User

    @valid_attrs %{email: "some email", name: "some name", password_hash: "some password_hash", username: "some username"}
    @update_attrs %{email: "some updated email", name: "some updated name", password_hash: "some updated password_hash", username: "some updated username"}
    @invalid_attrs %{email: nil, name: nil, password_hash: nil, username: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_user()

      user
    end

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Blog.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Blog.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Blog.create_user(@valid_attrs)
      assert user.email == "some email"
      assert user.name == "some name"
      assert user.password_hash == "some password_hash"
      assert user.username == "some username"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, user} = Blog.update_user(user, @update_attrs)
      assert %User{} = user
      assert user.email == "some updated email"
      assert user.name == "some updated name"
      assert user.password_hash == "some updated password_hash"
      assert user.username == "some updated username"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_user(user, @invalid_attrs)
      assert user == Blog.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Blog.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Blog.change_user(user)
    end
  end

  describe "followings" do
    alias Microblog.Blog.Follow

    @valid_attrs %{follower_user_id: "some follower_user_id", following_user_id: "some following_user_id"}
    @update_attrs %{follower_user_id: "some updated follower_user_id", following_user_id: "some updated following_user_id"}
    @invalid_attrs %{follower_user_id: nil, following_user_id: nil}

    def follow_fixture(attrs \\ %{}) do
      {:ok, follow} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_follow()

      follow
    end

    test "list_followings/0 returns all followings" do
      follow = follow_fixture()
      assert Blog.list_followings() == [follow]
    end

    test "get_follow!/1 returns the follow with given id" do
      follow = follow_fixture()
      assert Blog.get_follow!(follow.id) == follow
    end

    test "create_follow/1 with valid data creates a follow" do
      assert {:ok, %Follow{} = follow} = Blog.create_follow(@valid_attrs)
      assert follow.follower_user_id == "some follower_user_id"
      assert follow.following_user_id == "some following_user_id"
    end

    test "create_follow/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_follow(@invalid_attrs)
    end

    test "update_follow/2 with valid data updates the follow" do
      follow = follow_fixture()
      assert {:ok, follow} = Blog.update_follow(follow, @update_attrs)
      assert %Follow{} = follow
      assert follow.follower_user_id == "some updated follower_user_id"
      assert follow.following_user_id == "some updated following_user_id"
    end

    test "update_follow/2 with invalid data returns error changeset" do
      follow = follow_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_follow(follow, @invalid_attrs)
      assert follow == Blog.get_follow!(follow.id)
    end

    test "delete_follow/1 deletes the follow" do
      follow = follow_fixture()
      assert {:ok, %Follow{}} = Blog.delete_follow(follow)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_follow!(follow.id) end
    end

    test "change_follow/1 returns a follow changeset" do
      follow = follow_fixture()
      assert %Ecto.Changeset{} = Blog.change_follow(follow)
    end
  end

  describe "posts" do
    alias Microblog.Blog.Post

    @valid_attrs %{content: "some content", postid: 42, title: "some title", user_id: "some user_id"}
    @update_attrs %{content: "some updated content", postid: 43, title: "some updated title", user_id: "some updated user_id"}
    @invalid_attrs %{content: nil, postid: nil, title: nil, user_id: nil}

    def post_fixture(attrs \\ %{}) do
      {:ok, post} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_post()

      post
    end

    test "list_posts/0 returns all posts" do
      post = post_fixture()
      assert Blog.list_posts() == [post]
    end

    test "get_post!/1 returns the post with given id" do
      post = post_fixture()
      assert Blog.get_post!(post.id) == post
    end

    test "create_post/1 with valid data creates a post" do
      assert {:ok, %Post{} = post} = Blog.create_post(@valid_attrs)
      assert post.content == "some content"
      assert post.postid == 42
      assert post.title == "some title"
      assert post.user_id == "some user_id"
    end

    test "create_post/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_post(@invalid_attrs)
    end

    test "update_post/2 with valid data updates the post" do
      post = post_fixture()
      assert {:ok, post} = Blog.update_post(post, @update_attrs)
      assert %Post{} = post
      assert post.content == "some updated content"
      assert post.postid == 43
      assert post.title == "some updated title"
      assert post.user_id == "some updated user_id"
    end

    test "update_post/2 with invalid data returns error changeset" do
      post = post_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_post(post, @invalid_attrs)
      assert post == Blog.get_post!(post.id)
    end

    test "delete_post/1 deletes the post" do
      post = post_fixture()
      assert {:ok, %Post{}} = Blog.delete_post(post)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_post!(post.id) end
    end

    test "change_post/1 returns a post changeset" do
      post = post_fixture()
      assert %Ecto.Changeset{} = Blog.change_post(post)
    end
  end

  # describe "likes" do
  #   alias Microblog.Blog.Like

  #   @valid_attrs %{liked: "some liked", user: "some user"}
  #   @update_attrs %{liked: "some updated liked", user: "some updated user"}
  #   @invalid_attrs %{liked: nil, user: nil}

  #   def like_fixture(attrs \\ %{}) do
  #     {:ok, like} =
  #       attrs
  #       |> Enum.into(@valid_attrs)
  #       |> Blog.create_like()

  #     like
  #   end

  #   test "list_likes/0 returns all likes" do
  #     like = like_fixture()
  #     assert Blog.list_likes() == [like]
  #   end

  #   test "get_like!/1 returns the like with given id" do
  #     like = like_fixture()
  #     assert Blog.get_like!(like.id) == like
  #   end

  #   test "create_like/1 with valid data creates a like" do
  #     assert {:ok, %Like{} = like} = Blog.create_like(@valid_attrs)
  #     assert like.liked == "some liked"
  #     assert like.user == "some user"
  #   end

  #   test "create_like/1 with invalid data returns error changeset" do
  #     assert {:error, %Ecto.Changeset{}} = Blog.create_like(@invalid_attrs)
  #   end

  #   test "update_like/2 with valid data updates the like" do
  #     like = like_fixture()
  #     assert {:ok, like} = Blog.update_like(like, @update_attrs)
  #     assert %Like{} = like
  #     assert like.liked == "some updated liked"
  #     assert like.user == "some updated user"
  #   end

  #   test "update_like/2 with invalid data returns error changeset" do
  #     like = like_fixture()
  #     assert {:error, %Ecto.Changeset{}} = Blog.update_like(like, @invalid_attrs)
  #     assert like == Blog.get_like!(like.id)
  #   end

  #   test "delete_like/1 deletes the like" do
  #     like = like_fixture()
  #     assert {:ok, %Like{}} = Blog.delete_like(like)
  #     assert_raise Ecto.NoResultsError, fn -> Blog.get_like!(like.id) end
  #   end

  #   test "change_like/1 returns a like changeset" do
  #     like = like_fixture()
  #     assert %Ecto.Changeset{} = Blog.change_like(like)
  #   end
  # end

  describe "likes" do
    alias Microblog.Blog.Like

    @valid_attrs %{}
    @update_attrs %{}
    @invalid_attrs %{}

    def like_fixture(attrs \\ %{}) do
      {:ok, like} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_like()

      like
    end

    test "create_like/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_like(@invalid_attrs)
    end
  end
end
