defmodule Microblog.Blog.Post do
  use Ecto.Schema
  import Ecto.Changeset
  alias Microblog.Blog.Post


  schema "posts" do
    field :content, :string
    field :postid, :integer
    field :title, :string
    field :user_id, :string

    timestamps()
  end

  @doc false
  def changeset(%Post{} = post, attrs) do
    post
    |> cast(attrs, [:postid, :title, :content, :user_id])
    |> validate_required([:postid, :title, :content, :user_id])
  end
end
