DELIMITER //
CREATE PROCEDURE GetRecord( IN select_index BIGINT,
                            OUT title_name VARCHAR( 50 ),
                            OUT tag_index TINYINT,
                            OUT section_name VARCHAR( 80 ),
                            OUT column_name VARCHAR( 100 ) )
BEGIN
SELECT タイトル, タグインデックス, セクション, コラム
        INTO title_name, tag_index, section_name, column_name
    FROM レコード
WHERE 番号 = select_index;
END//
DELIMITER ;
