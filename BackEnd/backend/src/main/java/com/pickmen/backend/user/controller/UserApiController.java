package com.pickmen.backend.user.controller;

import java.util.List;

import com.pickmen.backend.RoleType;
import com.pickmen.backend.config.auth.PrincipalDetail;
import com.pickmen.backend.config.auth.PrincipalDetailsService;
import com.pickmen.backend.dto.LectureDto;
import com.pickmen.backend.dto.MajorDto;
import com.pickmen.backend.dto.ResponseDto;
import com.pickmen.backend.dto.SchoolDto;
import com.pickmen.backend.dto.UserDto;
import com.pickmen.backend.dto.detailDto;
import com.pickmen.backend.user.model.User;
import com.pickmen.backend.user.repository.UserRepository;
import com.pickmen.backend.user.service.ImageService;
import com.pickmen.backend.user.service.UserService;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class UserApiController {

  @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired private UserService userService;

  @Autowired private PrincipalDetailsService principalDetailsService;

  @Autowired private UserRepository userRepository;

  @Autowired private ImageService imageService;

  @PostMapping("/user/login")
  public @ResponseBody ResponseDto<User> login(@RequestParam("username") String username, @RequestParam("password") String password)
  {
    try {
      UserDetails userDetails=principalDetailsService.loadUserByUsername(username);

 
      if(bCryptPasswordEncoder.matches(password, userDetails.getPassword())){
        Authentication authentication=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return new ResponseDto<>(HttpStatus.OK.value(),userRepository.findByUsername(userDetails.getUsername()).get());
      }
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
     catch (NullPointerException e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @GetMapping("/user/checkDuplicateNickName")
  public @ResponseBody ResponseDto<Integer> duplicateCheck(@RequestParam("nickname")String nickname) {
    try {
      if(userRepository.findByNickname(nickname).isEmpty()) {
        System.out.println("중복되지 않음");
      return new ResponseDto<>(HttpStatus.OK.value(), null);
      }
      else
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    } catch (Exception e) {
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }
  @GetMapping("/user/checkDuplicateId")
  public @ResponseBody ResponseDto<Integer> duplicateCheckId(@RequestParam("username")String username) {
    try {
      if(userRepository.findByUsername(username).isEmpty()) {
        System.out.println("중복되지 않음");
      return new ResponseDto<>(HttpStatus.OK.value(), null);
      }
      else
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    } catch (Exception e) {
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @GetMapping("/user/get/profile")
  public @ResponseBody ResponseDto<User> myProfile(@AuthenticationPrincipal PrincipalDetail principalDetail) {
    try {
      return new ResponseDto<>(HttpStatus.OK.value(), userRepository.findByUsername(principalDetail.getUsername()).get());
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @GetMapping("/user/detailInfo")
  public @ResponseBody ResponseDto<detailDto> detailInfo(@AuthenticationPrincipal PrincipalDetail principalDetail) {
    try {
      detailDto dto=new detailDto();
      dto.setMajorName(principalDetail.getMajor().getName());
      dto.setSchoolName(principalDetail.getSchool().getName());
      dto.setEmail(principalDetail.getEmail());
      dto.setUserId(principalDetail.getUserId());
      dto.setNickName(principalDetail.getNickName());
      dto.setUserLecture(principalDetail.getLecture());
      return new ResponseDto<>(HttpStatus.OK.value(), dto);
    } catch (Exception e) {
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }
  

  @PostMapping("/user/mentor/signup")
  public @ResponseBody ResponseDto<User> signupMentor(@RequestParam("profile") MultipartFile uploadfile,User user,
		  @RequestParam List<Long> lectureList)
   {

     User newuser=new User();
     newuser.setLivingWhere(user.getLivingWhere());
     newuser.setUsername(user.getUsername());
     newuser.setPassword(user.getPassword());
     newuser.setNickname(user.getNickname());
     newuser.setAverageRating(3);
     newuser.setCreateDate(user.getCreateDate());
     newuser.setProfileImage(imageService.upload(uploadfile));     
     newuser.setEmail(user.getEmail());
     newuser.setSchool(user.getSchool());
     newuser.setMajor(user.getMajor());
     newuser.setRole(RoleType.MENTOR);
     
     // 멘토의 자기소개, 거주지, 멘토링 분야 설명 추가
     newuser.setIntroduceMyself(user.getIntroduceMyself());
     newuser.setLivingWhere(user.getLivingWhere());
     newuser.setMentoringContents(user.getMentoringContents());
     
    try {
      return new ResponseDto<>(HttpStatus.OK.value(), userService.join(newuser, lectureList));
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @GetMapping("/getProfile")
  public ResponseEntity<Resource> getProfile(@RequestParam(value = "userid", required = false) long userid)
  {
    User user=userRepository.findById(userid).orElseThrow();
    return imageService.display(user.getProfileImage());
  }

  @PostMapping("/user/mentee/signup")
  public @ResponseBody ResponseDto<User> signupMentee(@RequestParam(value = "profile", required = false) MultipartFile uploadfile, User user,
		  @RequestParam List<Long> lectureList)
   {
     User newuser=new User();
     newuser.setUsername(user.getUsername());
     newuser.setPassword(user.getPassword());
     newuser.setNickname(user.getNickname());
     newuser.setCreateDate(user.getCreateDate());
     newuser.setLivingWhere(user.getLivingWhere());
     newuser.setProfileImage(imageService.upload(uploadfile));  
     newuser.setEmail(user.getEmail());
     newuser.setSchool(user.getSchool());
     newuser.setMajor(user.getMajor());
     newuser.setLivingWhere(user.getLivingWhere());
     newuser.setRole(RoleType.MENTEE);
     // 학교, 전공 저장(학교, 전공은 Object)
     
     newuser.setLivingWhere(user.getLivingWhere());

     // 관심 강의 리스트는 userService.join에서 추가
    try {
      return new ResponseDto<>(HttpStatus.OK.value(), userService.join(newuser, lectureList));
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @PostMapping("/user/mentee/update")
  public @ResponseBody ResponseDto<User> user(@RequestParam(value = "profile", required = false) MultipartFile uploadfile, User user, @AuthenticationPrincipal PrincipalDetail principalDetail,
		 @RequestParam List<Long> lectureList) {
    try {
      user.setId(principalDetail.getUserId());
      User savedUser = userService.updateUser(user, lectureList,uploadfile);
      return new ResponseDto<>(HttpStatus.OK.value(), savedUser);
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }
  
  // 유저의 관심 강의 리스트를 프론트로 반환하는 URL
  @GetMapping("/lecture/get")
	public @ResponseBody ResponseEntity<List<LectureDto>> getUserLectureList(@AuthenticationPrincipal PrincipalDetail principalDetail) {
		return new ResponseEntity<List<LectureDto>>(userService.getUserLectureList(principalDetail.getUserId()), HttpStatus.OK);
	}
  
  @GetMapping("/lecture/get/{user_id}")
	public @ResponseBody ResponseEntity<List<LectureDto>> getUserLectureList(@PathVariable long user_id) {
		return new ResponseEntity<List<LectureDto>>(userService.getUserLectureList(user_id), HttpStatus.OK);
	}
  
  // 전체 관심 강의(전문 강의) 프론트로 반환
  @GetMapping("/lecture/getAll")
  public @ResponseBody ResponseEntity<List<LectureDto>> getAllLectureList() {
	  return new ResponseEntity<List<LectureDto>>(userService.getAllLectureList(), HttpStatus.OK);
  }
  
  // 전체 전공 리스트 프론트로 반환
  @GetMapping("/major/getAll")
   public @ResponseBody ResponseEntity<List<MajorDto>> getAllMajorList() {
	  return new ResponseEntity<List<MajorDto>>(userService.getAllMajorList(), HttpStatus.OK);
  }
  
  // 전체 학교 리스트 프론트로 반환
  @GetMapping("/school/getAll")
   public @ResponseBody ResponseEntity<List<SchoolDto>> getAllSchoolList() {
	  return new ResponseEntity<List<SchoolDto>>(userService.getAllSchoolList(), HttpStatus.OK);
  }
  
  // 한명의 유저의 필요한 정보들을 반환  
  // @GetMapping("/getUserDto/{user_id}")
  //  public @ResponseBody ResponseEntity<UserDto> getUserDto(@PathVariable Long user_id) {
	//   return new ResponseEntity<UserDto>(userService.getUserDto(user_id), HttpStatus.OK);
  // }
}


