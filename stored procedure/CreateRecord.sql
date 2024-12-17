DELIMITER //
CREATE PROCEDURE CreateRecord()
BEGIN
CREATE VIEW レコード AS (
    SELECT records.番号, records.タイトル, records.タグインデックス, records.セクション, records.コラム
        FROM (
            SELECT  ROW_NUMBER() OVER ( ORDER BY title.タグインデックス, title.インデックス ASC, section.インデックス ASC, columnName.インデックス ASC ) AS 番号,
                    title.タイトル, title.タグインデックス, section.セクション, columnName.コラム,
                    title.インデックス AS titleIndex, section.インデックス AS sectionIndex, columnName.インデックス AS columnIndex
                FROM タイトル名 AS title
            INNER JOIN セクション名 AS section
                ON title.インデックス = section.所属 AND title.タグインデックス = section.タグインデックス
            INNER JOIN コラム名 AS columnName
                ON section.インデックス = columnName.所属 AND section.所属 = columnName.タイトル・インデックス
                    AND section.タグインデックス = columnName.タグインデックス
        ) AS records
    ORDER BY records.タグインデックス ASC, records.titleIndex ASC, records.sectionIndex ASC, records.columnIndex ASC );
END//
DELIMITER ;


CREATE VIEW トレースレコード AS (
    SELECT records.番号, records.タイトル, records.タグインデックス, records.セクション, records.コラム
        FROM (
            SELECT  ROW_NUMBER() OVER ( ORDER BY title.タグインデックス ASC, title.インデックス ASC, section.インデックス ASC, columnName.インデックス ASC ) AS 番号,
                    title.タイトル, title.タグインデックス, section.セクション, columnName.コラム,
                    title.インデックス AS titleIndex, section.インデックス AS sectionIndex, columnName.インデックス AS columnIndex
                FROM タイトル名 AS title
            INNER JOIN セクション名 AS section
                ON title.インデックス = section.所属 AND title.タグインデックス = section.タグインデックス
            INNER JOIN コラム名 AS columnName
                ON section.インデックス = columnName.所属 AND section.所属 = columnName.タイトル・インデックス
                    AND section.タグインデックス = columnName.タグインデックス
        ) AS records
    ORDER BY records.タグインデックス ASC, records.titleIndex ASC, records.sectionIndex ASC, records.columnIndex ASC );
