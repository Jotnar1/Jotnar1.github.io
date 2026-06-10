# one-time scraper for icy veins build guides
param(
    [string[]]$Heroes = @(),
    [string]$OutFile = "js/data/heroBuilds.json"
)

$ErrorActionPreference = "SilentlyContinue"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$slugMap = @{
    "Abathur" = "abathur"; "Alarak" = "alarak"; "Alexstrasza" = "alexstrasza"; "Ana" = "ana"; "Anduin" = "anduin"
    "Anub'arak" = "anubarak"; "Arthas" = "arthas"; "Artanis" = "artanis"; "Auriel" = "auriel"; "Azmodan" = "azmodan"
    "Blaze" = "blaze"; "Brightwing" = "brightwing"; "Chen" = "chen"; "Cho" = "cho"; "Chromie" = "chromie"
    "D.Va" = "dva"; "Deathwing" = "deathwing"; "Deckard Cain" = "deckard"; "Dehaka" = "dehaka"; "Diablo" = "diablo"
    "E.T.C." = "etc"; "Falstad" = "falstad"; "Fenix" = "fenix"; "Gall" = "gall"; "Garrosh" = "garrosh"
    "Gazlowe" = "gazlowe"; "Genji" = "genji"; "Greymane" = "greymane"; "Gul'dan" = "guldan"; "Hanzo" = "hanzo"
    "Hogger" = "hogger"; "Illidan" = "illidan"; "Imperius" = "imperius"; "Jaina" = "jaina"; "Johanna" = "johanna"
    "Junkrat" = "junkrat"; "Kael'thas" = "kaelthas"; "Kel'Thuzad" = "kel-thuzad"; "Kerrigan" = "kerrigan"; "Kharazim" = "kharazim"
    "Leoric" = "leoric"; "Li Li" = "li-li"; "Li-Ming" = "li-ming"; "Lt. Morales" = "lt-morales"; "Lúcio" = "lucio"
    "Lunara" = "lunara"; "Maiev" = "maiev"; "Mal'Ganis" = "malganis"; "Malfurion" = "malfurion"; "Malthael" = "malthael"
    "Medivh" = "medivh"; "Mei" = "mei"; "Mephisto" = "mephisto"; "Muradin" = "muradin"; "Murky" = "murky"
    "Nazeebo" = "nazeebo"; "Nova" = "nova"; "Orphea" = "orphea"; "Probius" = "probius"; "Qhira" = "qhira"
    "Ragnaros" = "ragnaros"; "Raynor" = "raynor"; "Rehgar" = "rehgar"; "Rexxar" = "rexxar"; "Samuro" = "samuro"
    "Sgt. Hammer" = "sgt-hammer"; "Sonya" = "sonya"; "Stitches" = "stitches"; "Stukov" = "stukov"; "Sylvanas" = "sylvanas"
    "Tassadar" = "tassadar"; "The Butcher" = "the-butcher"; "The Lost Vikings" = "the-lost-vikings"; "Thrall" = "thrall"
    "Tracer" = "tracer"; "Tychus" = "tychus"; "Tyrael" = "tyrael"; "Tyrande" = "tyrande"; "Uther" = "uther"
    "Valeera" = "valeera"; "Valla" = "valla"; "Varian" = "varian"; "Whitemane" = "whitemane"; "Xul" = "xul"
    "Yrel" = "yrel"; "Zagara" = "zagara"; "Zarya" = "zarya"; "Zeratul" = "zeratul"; "Zul'jin" = "zuljin"
    "Cassia" = "cassia"
}

function Convert-TalentSlug {
    param([string]$Tooltip, [string]$HeroSlug)
    $prefix = "$HeroSlug-talent-"
    if ($Tooltip -like "$prefix*") {
        $slug = $Tooltip.Substring($prefix.Length)
        return (Get-Culture).TextInfo.ToTitleCase($slug.Replace('-', ' '))
    }
    return $null
}

function Get-BuildTags {
    param([string]$Text)
    $tags = @()
    $lower = $Text.ToLowerInvariant()
    if ($lower -match 'ranged|kite|poke|long range|from afar|from the distance') { $tags += 'vsRanged' }
    if ($lower -match 'melee|basic attack|low-mobility|low mobility') { $tags += 'vsMelee' }
    if ($lower -match 'burst|mages|ability damage|abilities') { $tags += 'vsBurst' }
    if ($lower -match 'healer|healing|support') { $tags += 'vsHealer' }
    if ($lower -match 'assassin|mobile|mobility') { $tags += 'vsAssassin' }
    if ($lower -match 'tank|frontline|bruiser') { $tags += 'vsTank' }
    if ($lower -match 'surviv|durabl|self-sustain|anti-burst') { $tags += 'survival' }
    if ($lower -match 'team fight|short team|prolonged') { $tags += 'teamfight' }
    if ($lower -match 'waveclear|lane|macro|mercenar') { $tags += 'macro' }
    return ($tags | Select-Object -Unique)
}

function Parse-BuildGuide {
    param([string]$Html, [string]$HeroSlug, [string]$HeroName)
    $builds = @()
    $parts = $Html -split '<div class="heroes_build_header">'
    foreach ($part in $parts[1..($parts.Length - 1)]) {
        $nameMatch = [regex]::Match($part, '<h3[^>]*>([^<]+)</h3>')
        if (-not $nameMatch.Success) { continue }
        $name = $nameMatch.Groups[1].Value.Trim()
        if ($name -match 'Cheatsheet|Overview|Build Guide') { continue }

        $talentStart = $part.IndexOf('<div class="heroes_build_talents">')
        if ($talentStart -lt 0) { continue }
        $talentBlock = $part.Substring($talentStart)
        $talentEnd = $talentBlock.IndexOf('</div>', $talentBlock.LastIndexOf('heroes_build_talent_tier'))
        if ($talentEnd -lt 0) { continue }
        $talentBlock = $talentBlock.Substring(0, $talentEnd)

        $talents = @{}
        $heroics = @()
        $tierMatches = [regex]::Matches($talentBlock, '(?s)<div class="heroes_build_talent_tier[^"]*">(.*?)</div>\s*(?=<div class="heroes_build_talent_tier|$)')
        foreach ($tier in $tierMatches) {
            $tierHtml = $tier.Groups[1].Value
            $levelMatch = [regex]::Match($tierHtml, 'Level (\d+)')
            if (-not $levelMatch.Success) { continue }
            $level = [int]$levelMatch.Groups[1].Value
            $recMatch = [regex]::Match($tierHtml, 'heroes_build_talent_tier_recommended[^>]*data-heroes-tooltip="([^"]+)"')
            if ($recMatch.Success) {
                $talentName = Convert-TalentSlug $recMatch.Groups[1].Value $HeroSlug
                if ($talentName) {
                    if ($level -eq 10 -or $level -eq 20) { $heroics += $talentName }
                    $talents["$level"] = $talentName
                }
            }
        }
        if ($talents.Count -lt 4) { continue }

        $afterTalents = $part.Substring($talentStart + $talentEnd)
        $descMatch = [regex]::Match($afterTalents, '(?s)<p>(.*?)</p>')
        $desc = if ($descMatch.Success) { ($descMatch.Groups[1].Value -replace '<[^>]+>', '').Trim() } else { '' }
        $tagMatch = [regex]::Match($part, 'heroes_build_tag_(\w+)')
        $tierTag = if ($tagMatch.Success) { $tagMatch.Groups[1].Value } else { 'standard' }
        $builds += [ordered]@{
            id = ($name.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
            name = $name
            tier = $tierTag
            talents = $talents
            heroics = $heroics
            description = $desc
            tags = @(Get-BuildTags "$name $desc")
            source = "https://www.icy-veins.com/heroes/$HeroSlug-build-guide"
        }
    }
    return $builds
}

$heroList = if ($Heroes.Count -gt 0) { $Heroes } else { $slugMap.Keys }
$result = @{}
$failed = @()

foreach ($hero in ($heroList | Sort-Object)) {
    $slug = $slugMap[$hero]
    if (-not $slug) { $failed += $hero; continue }
    $url = "https://www.icy-veins.com/heroes/$slug-build-guide"
    try {
        $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20).Content
        $builds = Parse-BuildGuide $html $slug $hero
        if ($builds.Count -gt 0) {
            $result[$hero] = $builds
            Write-Host "OK $hero ($($builds.Count) builds)"
        } else {
            $failed += $hero
            Write-Host "EMPTY $hero"
        }
        Start-Sleep -Milliseconds 350
    } catch {
        $failed += $hero
        Write-Host "FAIL $hero"
    }
}

$outPath = Join-Path $root $OutFile
$json = $result | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($outPath, $json, [System.Text.UTF8Encoding]::new($false))
Write-Host "Saved $($result.Count) heroes to $outPath"
if ($failed.Count -gt 0) { Write-Host "Failed: $($failed -join ', ')" }
