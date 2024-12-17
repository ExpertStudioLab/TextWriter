DELIMITER //
CREATE PROCEDURE InsertColumn( IN title VARCHAR( 50 ), IN tagIndex TINYINT,
                            IN section VARCHAR( 80 ), IN columnName VARCHAR( 100 ),
                            OUT result VARCHAR( 20 ) )
BEGIN
    DECLARE titleIndex SMALLINT;
    DECLARE sectionIndex TINYINT;
    DECLARE columnIndex TINYINT;

    DECLARE titleCount BIGINT;
    DECLARE sectionCount TINYINT;
    DECLARE columnCount TINYINT;

    SELECT COUNT( * ) INTO titleCount
        FROM タイトル名
    WHERE タグインデックス = tagIndex;

    IF( SELECT COUNT( * ) FROM タイトル名
        WHERE タイトル = title AND タグインデックス = tagIndex ) = 0 THEN
        BEGIN
            INSERT INTO タイトル名( インデックス,タイトル, タグインデックス )
            VALUES( titleCount + 1, title, tagIndex );
        END;
    END IF;

    SELECT インデックス INTO titleIndex
        FROM タイトル名
    WHERE タイトル = title AND タグインデックス = tagIndex;

    SELECT COUNT( * ) INTO sectionCount
        FROM レコード
    WHERE タイトル = title AND タグインデックス = tagIndex;

    IF( SELECT COUNT( * ) FROM セクション名
        WHERE セクション = section AND 所属 = titleIndex AND タグインデックス = tagIndex ) = 0 THEN
        BEGIN
            INSERT INTO セクション名( インデックス, セクション, 所属, タグインデックス )
            VALUES( sectionCount + 1, section, titleIndex, tagIndex );
        END;
    END IF;

    SELECT インデックス INTO sectionIndex
        FROM セクション名
    WHERE セクション = section AND 所属 = titleIndex AND タグインデックス = tagIndex;

    SELECT COUNT( * ) INTO columnCount
        FROM レコード
    WHERE タイトル = title AND タグインデックス = tagIndex
        AND セクション = section;

    IF( SELECT COUNT( * ) FROM コラム名
        WHERE コラム = columnName AND 所属 = sectionIndex
            AND タイトル・インデックス = titleIndex
            AND タグインデックス = tagIndex ) = 0 THEN
        BEGIN
            INSERT INTO コラム名( インデックス, コラム, 所属, タイトル・インデックス, タグインデックス )
            VALUES( columnCount + 1, columnName, sectionIndex, titleIndex, tagIndex );
        END;
    END IF;

    SELECT インデックス INTO columnIndex
    FROM コラム名
    WHERE コラム = columnName AND 所属 = sectionIndex AND タイトル・インデックス = titleIndex AND タグインデックス = tagIndex;

    SET result = CONCAT_WS( '_', CAST( tagIndex AS CHAR ), CAST( titleIndex AS CHAR ), CAST( sectionIndex AS CHAR ),
                            CAST( columnIndex AS CHAR ) );
END //
DELIMITER ;
