defmodule MicroblogWeb.LikeControllerTest do
  use MicroblogWeb.ConnCase

  alias Microblog.Blog
  alias Microblog.Blog.Like

  @create_attrs %{}
  @update_attrs %{}
  @invalid_attrs %{}

  def fixture(:like) do
    {:ok, like} = Blog.create_like(@create_attrs)
    like
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  defp create_like(_) do
    like = fixture(:like)
    {:ok, like: like}
  end
end
