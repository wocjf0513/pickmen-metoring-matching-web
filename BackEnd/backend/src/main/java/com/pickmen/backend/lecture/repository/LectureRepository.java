package com.pickmen.backend.lecture.repository;

import com.pickmen.backend.lecture.model.Lecture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureRepository extends JpaRepository <Lecture,Long>{
}
