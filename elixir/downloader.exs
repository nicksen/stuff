#!/usr/bin/env elixir

defmodule Committer do
  defstruct [:name, :email]

  def list(repo) do
    repo
    |> from_repo()
    |> Stream.unfold(fn str ->
      case String.split(str, ~r(\r\n|\r|\n), parts: 2, trim: true) do
        [] ->
          nil

        [value] ->
          {value, ""}

        list ->
          List.to_tuple(list)
      end
    end)
    |> Stream.map(&String.split(&1, "|", parts: 2))
    |> Stream.map(&Enum.zip([:name, :email], &1))
    |> Stream.map(&struct(Committer, &1))
    |> Stream.uniq_by(&(&1.email))
  end

  def fetch_gravatar(%Committer{email: email}, format \\ :png) do
    request = {gravatar_url(email, format), []}
    http_opts = [timeout: 5_000]
    opts = [body_format: :binary, full_result: false]

    case :httpc.request(:get, request, http_opts, opts) do
      {:ok, {200, body}} ->
        {:ok, body}

      {:ok, {num, _}} ->
        {:error, "response code #{num}"}

      {:error, _} = error ->
        error
    end
  end

  @base_url "http://www.gravatar.com/avatar/"
  @url_params "?d=identicon&s=200"
  defp gravatar_url(email, format) do
    '#{@base_url}#{email_hash(email)}.#{format}#{@url_params}'
  end

  defp email_hash(email) do
    email
    |> String.trim()
    |> String.downcase()
    |> hash()
    |> Base.encode16(case: :lower)
  end

  defp hash(email) do
    :crypto.hash(:md5, email)
  end

  defp from_repo(repo) do
    args = ["log", ~S{--pretty=format:%an|%ae}, "--encoding=UTF-8"]

    case System.cmd("git", args, cd: repo) do
      {committers, 0} ->
        committers

      {_, code} ->
        raise RuntimeError, "`git log` failed with code #{code}"
    end
  end
end

defmodule Download do
  require Logger

  def run(args) do
    Application.ensure_all_started(:inets)

    {repo, out} = parse_args(args)
    File.mkdir_p!(out)

    File.cd!(out, fn ->
      repo
      |> Committer.list()
      |> Stream.chunk_every(50, 50, [])
      |> Stream.each(&fetch_and_save_batch/1)
      |> Stream.run()
    end)
  end

  defp fetch_and_save_batch(committers) do
    committers
    |> Enum.map(&Task.async(fn -> fetch_and_save(&1) end))
    |> Enum.map(&Task.await(&1, 10_000))
  end

  defp fetch_and_save(%Committer{name: name, email: email} = committer) do
    fname = "#{name} (#{email})"
    case Committer.fetch_gravatar(committer, :png) do
      {:ok, image} ->
        File.write!("#{fname}.png", image)
        Logger.info("downloaded gravatar for #{fname}")

      {:error, reason} ->
        Logger.error("failed to download gravatar for #{fname}, because: #{inspect(reason)}")
    end
  end

  defp parse_args(args) do
    case OptionParser.parse(args) do
      {_, [repo, out], _} ->
        {repo, out}

      _ ->
        IO.puts("Usage: download repository output_dir\n")
        raise "Wrong arguments given to `download`"
    end
  end
end

Download.run(System.argv)
