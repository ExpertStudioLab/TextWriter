DELIMITER //
CREATE PROCEDURE GetTag( IN tag_index TINYINT, OUT tag_name VARCHAR( 40 ) )
BEGIN
SELECT タグ INTO tag_name
    FROM タグ名
WHERE インデックス = tag_index;
END//
DELIMITER ;
