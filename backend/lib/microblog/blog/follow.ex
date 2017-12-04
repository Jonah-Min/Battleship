defmodule Microblog.Blog.Follow do
  use Ecto.Schema
  import Ecto.Changeset
  alias Microblog.Blog.Follow


  schema "followings" do
    field :follower_user_id, :string
    field :following_user_id, :string

    timestamps()
  end

  @doc false
  def changeset(%Follow{} = follow, attrs) do
    follow
    |> cast(attrs, [:follower_user_id, :following_user_id])
    |> validate_required([:follower_user_id, :following_user_id])
  end
end
