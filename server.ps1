$port = 8080
$endpoint = [System.Net.IPEndPoint]::new([System.Net.IPAddress]::Loopback, $port)
$tcpListener = [System.Net.Sockets.TcpListener]::new($endpoint)

try {
    $tcpListener.Start()
    Write-Output "SERVER_READY: http://localhost:$port/"
    
    while ($true) {
        $client = $tcpListener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII)
        $requestLine = $reader.ReadLine()
        
        if (-not [string]::IsNullOrWhiteSpace($requestLine)) {
            $parts = $requestLine.Split(' ')
            $path = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
            $cleanPath = $path.Split('?')[0].TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($cleanPath)) { $cleanPath = "index.html" }
            
            $filePath = Join-Path (Get-Location) $cleanPath
            
            if (Test-Path $filePath -PathType Leaf) {
                $contentBytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    default { "application/octet-stream" }
                }
                
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($contentBytes.Length)`r`nConnection: close`r`nAccess-Control-Allow-Origin: *`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($contentBytes, 0, $contentBytes.Length)
            } else {
                $errBody = "404 Not Found"
                $errBytes = [System.Text.Encoding]::ASCII.GetBytes($errBody)
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($errBytes.Length)`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($errBytes, 0, $errBytes.Length)
            }
        }
        $stream.Flush()
        $client.Close()
    }
} catch {
    Write-Output "SERVER_ERROR: $_"
} finally {
    $tcpListener.Stop()
}
