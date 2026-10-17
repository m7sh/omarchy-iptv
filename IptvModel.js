function filterChannels(channels, query, group) {
  var q = String(query || "").trim().toLowerCase();
  var wide = !group || group === "All";
  var tokens = q ? q.split(/\s+/) : [];
  return (channels || []).filter(function (c) {
    if (!wide && c.group !== group) return false;
    if (tokens.length === 0) return true;
    var name = String(c.name || "").toLowerCase();
    var grp = wide ? String(c.group || "Ungrouped").toLowerCase() : "";
    return tokens.every(function (t) {
      return name.indexOf(t) !== -1 || (wide && grp.indexOf(t) !== -1);
    });
  });
}

function filterEpg(epgList, query, favsOnly, favs) {
  var q = String(query || "").trim().toLowerCase();
  var tokens = q ? q.split(/\s+/) : [];
  var favMap = {};
  if (favsOnly) {
    (favs || []).forEach(function (f) {
      if (f && f.id) favMap[String(f.id)] = true;
    });
  }
  return (epgList || []).filter(function (item) {
    if (!item) return false;
    if (favsOnly && !favMap[String(item.channel_id)]) return false;
    if (tokens.length === 0) return true;
    var name = String(item.name || "").toLowerCase();
    var now = String(item.now || "").toLowerCase();
    var next = String(item.next || "").toLowerCase();
    var grp = String(item.group || "").toLowerCase();
    return tokens.every(function (t) {
      return name.indexOf(t) !== -1 || now.indexOf(t) !== -1 || next.indexOf(t) !== -1 || grp.indexOf(t) !== -1;
    });
  });
}

function groups(channels) {
  var seen = {};
  var out = ["All"];
  (channels || []).forEach(function (c) {
    var g = c.group || "Ungrouped";
    if (!seen[g]) {
      seen[g] = true;
      out.push(g);
    }
  });
  return out;
}

function favKey(kind, id) {
  return String(kind) + ":" + String(id);
}

function toggleFavList(favs, kind, item) {
  var k = favKey(kind, item.id);
  var found = false;
  var next = (favs || []).filter(function (f) {
    if (favKey(f.kind, f.id) === k) {
      found = true;
      return false;
    }
    return true;
  });
  if (!found) next.push({ kind: kind, id: item.id, name: item.name || String(item.id) });
  return next;
}

function isFavInList(favs, kind, id) {
  var k = favKey(kind, id);
  return (favs || []).some(function (f) { return favKey(f.kind, f.id) === k; });
}

function resolveFavs(favs, kind, pool) {
  var byId = {};
  (pool || []).forEach(function (c) { byId[String(c.id)] = c; });
  var out = [];
  (favs || []).forEach(function (f) {
    if (f.kind !== kind) return;
    var hit = byId[String(f.id)];
    if (hit) out.push(hit);
    else out.push({ id: f.id, name: f.name, url: "", available: false });
  });
  return out;
}

function moveFav(favs, kind, id, delta) {
  var k = favKey(kind, id);
  var list = (favs || []).slice();
  var matchIndices = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i] && list[i].kind === kind) matchIndices.push(i);
  }
  var pos = -1;
  for (var j = 0; j < matchIndices.length; j++) {
    var f = list[matchIndices[j]];
    if (favKey(f.kind, f.id) === k) {
      pos = j;
      break;
    }
  }
  if (pos === -1) return list;
  var nextPos = pos + delta;
  if (nextPos < 0 || nextPos >= matchIndices.length) return list;
  var idxA = matchIndices[pos];
  var idxB = matchIndices[nextPos];
  var tmp = list[idxA];
  list[idxA] = list[idxB];
  list[idxB] = tmp;
  return list;
}

function parseBadge(name) {
  var s = String(name || "");
  if (/4k|2160p|uhd/i.test(s)) return "4K";
  if (/1080p|fhd/i.test(s)) return "FHD";
  if (/720p|hd/i.test(s)) return "HD";
  if (/576p|sd/i.test(s)) return "SD";
  return "";
}

function addToHistory(history, item, maxItems) {
  maxItems = maxItems || 25;
  if (!item || !item.id) return history || [];
  var sid = String(item.id);
  var list = (history || []).filter(function (x) {
    return String(x.id) !== sid;
  });
  list.unshift({
    id: item.id,
    name: item.name || String(item.id),
    kind: item.kind || "live",
    logo: item.logo || "",
    group: item.group || "",
    timestamp: Date.now()
  });
  return list.slice(0, maxItems);
}
