DROP TABLE コラム名;
DROP TABLE セクション名;
DROP TABLE タイトル名;
DROP TABLE タグ名;

CREATE TABLE タグ名(
    インデックス TINYINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    タグ VARCHAR( 40 ) NOT NULL,
    UNIQUE KEY タグ・ユニーク・キー(タグ)
);

CREATE TABLE タイトル名(
    インデックス SMALLINT NOT NULL,
    タイトル VARCHAR( 50 ) NOT NULL,
    タグインデックス TINYINT NOT NULL,
    UNIQUE KEY タイトル・ユニーク・キー(タイトル,タグインデックス),
    PRIMARY KEY(インデックス,タグインデックス),
    CONSTRAINT タイトル外部キー FOREIGN KEY(タグインデックス) REFERENCES タグ名(インデックス)
);

CREATE TABLE セクション名(
    インデックス TINYINT NOT NULL,
    セクション VARCHAR( 80 ) NOT NULL,
    所属 SMALLINT NOT NULL,
    タグインデックス TINYINT NOT NULL,
    UNIQUE KEY セクション・ユニーク・キー(セクション,所属,タグインデックス),
    PRIMARY KEY(インデックス,所属,タグインデックス),
    CONSTRAINT セクション外部キー FOREIGN KEY(所属) REFERENCES タイトル名(インデックス),
    CONSTRAINT セクション・タグ外部キー FOREIGN KEY(タグインデックス) REFERENCES タグ名(インデックス)
);

CREATE TABLE コラム名(
    インデックス TINYINT NOT NULL,
    コラム VARCHAR( 100 ) NOT NULL,
    所属 TINYINT NOT NULL,
    タイトル・インデックス SMALLINT NOT NULL,
    タグインデックス TINYINT NOT NULL,
    UNIQUE KEY コラム・ユニーク・キー(コラム,所属,タイトル・インデックス,タグインデックス),
    PRIMARY KEY(インデックス,所属,タイトル・インデックス,タグインデックス),
    CONSTRAINT コラム外部キー FOREIGN KEY(所属) REFERENCES セクション名(インデックス),
    CONSTRAINT コラム・タイトル外部キー FOREIGN KEY(タイトル・インデックス) REFERENCES セクション名(所属),
    CONSTRAINT コラム・タグ外部キー FOREIGN KEY(タグインデックス) REFERENCES タグ名(インデックス)
);
