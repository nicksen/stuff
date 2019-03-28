defmodule HTTPStream do

  def get(url) do
    Stream.resource(fn -> start_fun(url) end, &next_fun/1, &end_fun/1)
  end

  defp start_fun(url) do
    HTTPoison.get!(url, %{}, [stream_to: self(), async: :once])
  end

  defp next_fun(%HTTPoison.AsyncResponse{id: id} = resp) do
    receive do
      %HTTPoison.AsyncStatus{id: ^id, code: code} ->
        IO.inspect(code, label: "STATUS: ")
        {[], resp}

      %HTTPoison.AsyncHeader{id: ^id, headers: headers} ->
        IO.inspect(headers, label: "HEADERS: ")
        HTTPoison.stream_next(resp)
        {[], resp}

      %HTTPoison.AsyncChunk{id: ^id, chunk: chunk} ->
        HTTPoison.stream_next(resp)
        {[chunk], resp}

      %HTTPoison.AsyncEnc{id: ^id} ->
        {:halt, resp}
    after
      5_000 -> raise "receive timeout"
    end
  end

  defp end_fun(resp) do
    :hackney.stop_async(resp.id)
  end
end
