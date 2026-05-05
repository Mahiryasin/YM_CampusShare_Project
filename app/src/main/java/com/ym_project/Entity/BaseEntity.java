package com.ym_project.Entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate;

    @CreatedBy
    @Column(name = "create_by", updatable = false)
    private String createBy;

    @LastModifiedDate
    @Column(name = "update_date", insertable = false)
    private LocalDateTime updateDate;

    @LastModifiedBy
    @Column(name = "update_by", insertable = false)
    private String updateBy;

}
