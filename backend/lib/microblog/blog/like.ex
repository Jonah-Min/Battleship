defmodule Microblog.Blog.Like do
  use Ecto.Schema
  import Ecto.Changeset
  alias Microblog.Blog.Like


  schema "likes" do
    belongs_to :liked_post, Microblog.Blog.Post
    belongs_to :user, Microblog.Blog.User

    timestamps()
  end

  @doc false
  def changeset(%Like{} = like, attrs) do
    like
    |> cast(attrs, [:liked_post_id, :user_id])
    |> validate_required([:liked_post_id, :user_id])
  end
end
