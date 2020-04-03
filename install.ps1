# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

Param (
  [string]$bundle = $( Read-Host "What bundle?" ),
  [switch]$dryRun = $false
)

Function Gunzip-File{
    Param($infile)
    $infile = (Get-Item $infile).fullname
    $outfile = ($infile -replace '\.gz$','') 
    $input = New-Object System.IO.FileStream $inFile, ([IO.FileMode]::Open), ([IO.FileAccess]::Read), ([IO.FileShare]::Read)
    $output = New-Object System.IO.FileStream $outFile, ([IO.FileMode]::Create), ([IO.FileAccess]::Write), ([IO.FileShare]::None)
    $gzipStream = New-Object System.IO.Compression.GzipStream $input, ([IO.Compression.CompressionMode]::Decompress)
    $buffer = New-Object byte[](1024)
    while($true){
        $read = $gzipstream.Read($buffer, 0, 1024)
        if ($read -le 0){break}
        $output.Write($buffer, 0, $read)
        }
    $gzipStream.Close()
    $output.Close()
    $input.Close()
    return $outfile
}

Write-Host ''
Write-Host "Installing $BUNDLE ..."
Write-Host ''

$title    = 'JWT Keys'
$question = 'Update jwt public/private keys?'
$choices  = '&Yes', '&No'

New-Item -ItemType directory -Path tmp_config_jwt -Force
Remove-Item tmp_config_jwt/* -Recurse -Force
Copy-Item -Path config/jwt/*.pem -Destination tmp_config_jwt/ -Force

$decision = $Host.UI.PromptForChoice($title, $question, $choices, 1)
if ($decision -eq 0) {
  $JWT_PASSPHRASE = ((Select-String -Path .env.local -Pattern "JWT_PASSPHRASE") -split "=")[1]
  Write-Host "Generating primary key using JWT_PASSPHRASE defined in '.env.local' ($JWT_PASSPHRASE)"
  openssl genpkey -out tmp_config_jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:$JWT_PASSPHRASE
  openssl pkey -in tmp_config_jwt/private.pem -out tmp_config_jwt/public.pem -pubout -passin pass:$JWT_PASSPHRASE
} else {
  Write-Host "Using same JWT public/private keys as before."
}

$title    = 'Backup current site?'
$question = 'Would you like to backup the current site to ./backup before installing?'
$choices  = '&Yes', '&No'

$decision = $Host.UI.PromptForChoice($title, $question, $choices, 1)
if ($decision -eq 0) {
  Write-Host "Backing up entire current site to './backup'"
  Remove-Item backup -Recurse -Force -ErrorAction Ignore
  New-Item -ItemType directory -Path backup -Force
  Copy-Item -Path ./* -Destination ./backup -Recurse -ErrorAction Ignore
}

$title    = 'Start the install?'
$question = 'The site will be down during install, are you sure you want to proceed?'
$choices  = '&Yes', '&No'

$decision = $Host.UI.PromptForChoice($title, $question, $choices, 1)
if ($decision -eq 0) {  
  Write-Host "Deleting current site ..."
  Remove-Item bin, composer.json, composer.lock, config, phpunit.xml.dist, public, README.md, src, symfony.lock, templates, translations, vendor -Recurse -Force -ErrorAction Ignore

  Write-Host "Unpacking $bundle ..."
  $gunzippedFile = Gunzip-File $bundle
  7z x $gunzippedFile -aoa
  Remove-Item $gunzippedFile -Force

  Write-Host "Moving JWT public/private keys to config/jwt ..."
  New-Item -ItemType directory -Path config/jwt
  Move-Item -Path tmp_config_jwt/* -Destination config/jwt
  Remove-Item tmp_config_jwt -Recurse

  Write-Host 'Clearing and warming up backend cache ...'
  $env:APP_ENV='prod'; $env:APP_DEBUG=0; php bin/console cache:clear
 
  Write-Host 'Checking if database is up-to-date ...'
  $env:APP_ENV='prod'; $env:APP_DEBUG=0; php bin/console doctrine:schema:update --dump-sql
 
  Write-Host ''
  Write-Host "Install of $bundle complete."
  Write-Host ''
} else {
  Write-Host "Moving JWT public/private keys to config/jwt ..."
  New-Item -ItemType directory -Path config/jwt
  Move-Item -Path tmp_config_jwt/* -Destination config/jwt
  Remove-Item tmp_config_jwt -Recurse

  Write-Host 'cancelled'
}
