defmodule Microblog.Blog.User do
  use Ecto.Schema
  import Ecto.Changeset
  import Comeonin
  import Comeonin.Argon2
  alias Microblog.Blog.User


  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    field :username, :string

    timestamps()
  end

  @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:name, :password, :email, :username])
    # |> validate_confirmation(:password)
    |> validate_password(:password)
    |> put_pass_hash()
    |> validate_required([:name, :password_hash, :email, :username])
  end

  # Password validation
  # From Comeonin docs
  def validate_password(changeset, field, options \\ []) do
    validate_change(changeset, field, fn _, password ->
      case valid_password?(password) do
        {:ok, _} -> []
        {:error, msg} -> [{field, options[:message] || msg}]
      end
    end)
  end

  def put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, Comeonin.Argon2.add_hash(password, hash_key: :password_hash))

    # IO.puts changeset   IO.puts Comeonin.Argon2.add_hash(password).password_hash
    # # IO.puts %{"password_hash" => Comeonin.Argon2.add_hash(password).password_hash}
    # change(changeset, %{"password_hash" => Comeonin.Argon2.add_hash(password).password_hash})
    # IO.puts changeset
    
  end
  def put_pass_hash(changeset), do: changeset

  def valid_password?(password) when byte_size(password) > 0 do
    {:ok, password}
  end
  def valid_password?(_), do: {:error, "The password is too short"}
end
