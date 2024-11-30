DELIMITER //
CREATE PROCEDURE InsertColumn( IN title VARCHAR( 50 ), IN tagIndex TINYINT,
                            IN section VARCHAR( 80 ), IN columnName VARCHAR( 100 ),
                            OUT result VARCHAR( 20 ) )
BEGIN
    DECLARE titleIndex SMALLINT;
    DECLARE sectionIndex TINYINT;
    DECLARE columnIndex TINYINT;

    INSERT INTO タイトル名( タイトル, タグインデックス )
    VALUES( title, tagIndex );

    SELECT インデックス INTO titleIndex
    FROM タイトル名
    WHERE タイトル = title;

    INSERT INTO セクション名( セクション, 所属 )
    VALUES( section, titleIndex );

    SELECT インデックス INTO sectionIndex
    FROM セクション名
    WHERE セクション = section;

    INSERT INTO コラム名( コラム, 所属 )
    VALUES( columnName, sectionIndex );

    SELECT インデックス INTO columnIndex
    FROM コラム名
    WHERE コラム = columnName;

    SET result = CONCAT_WS( '_', CAST( titleIndex AS CHAR ), CAST( sectionIndex AS CHAR ),
                            CAST( columnIndex AS CHAR ) );
END //
DELIMITER ;
